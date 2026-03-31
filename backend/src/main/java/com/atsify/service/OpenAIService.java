package com.atsify.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service for OpenAI API integration.
 * Falls back to built-in suggestions when no API key is configured.
 */
@Service
public class OpenAIService {

    private static final Logger log = LoggerFactory.getLogger(OpenAIService.class);

    @Value("${app.openai.api-key:}")
    private String apiKey;

    @Value("${app.openai.model:gpt-3.5-turbo}")
    private String model;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public List<String> getSuggestions(
            String resumeText,
            String jobDescription,
            List<String> matchedKeywords,
            List<String> missingKeywords,
            double score
    ) {
        if (apiKey == null || apiKey.isBlank()) {
            log.info("OpenAI API key not configured — using built-in suggestions");
            return generateBuiltInSuggestions(matchedKeywords, missingKeywords, score);
        }

        try {
            return callOpenAI(resumeText, jobDescription, missingKeywords, score);
        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage());
            return generateBuiltInSuggestions(matchedKeywords, missingKeywords, score);
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> callOpenAI(
            String resumeText,
            String jobDescription,
            List<String> missingKeywords,
            double score
    ) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format(
                """
                You are an expert ATS resume consultant.
                
                The candidate's resume has an ATS match score of %.1f%% against the job description.
                
                Missing keywords: %s
                
                Job Description:
                %s
                
                Resume Text:
                %s
                
                Provide exactly 5 specific, actionable suggestions to improve this resume's ATS score.
                Each suggestion should be a single clear sentence.
                Return ONLY the 5 suggestions, one per line, numbered 1-5.
                """,
                score,
                String.join(", ", missingKeywords),
                jobDescription.substring(0, Math.min(jobDescription.length(), 1000)),
                resumeText.substring(0, Math.min(resumeText.length(), 2000))
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "You are an expert ATS resume consultant."),
                Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                OPENAI_API_URL, HttpMethod.POST, entity, Map.class
        );

        if (response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String content = (String) message.get("content");

                return Arrays.stream(content.split("\n"))
                        .map(String::trim)
                        .filter(line -> !line.isBlank())
                        .map(line -> line.replaceAll("^\\d+\\.\\s*", ""))
                        .limit(5)
                        .toList();
            }
        }

        return generateBuiltInSuggestions(List.of(), List.of(), score);
    }

    private List<String> generateBuiltInSuggestions(
            List<String> matchedKeywords,
            List<String> missingKeywords,
            double score
    ) {
        List<String> suggestions = new ArrayList<>();

        if (score < 30) {
            suggestions.add("Your resume needs significant updates to match this job description. Consider rewriting your summary and experience sections to align with the required qualifications.");
        } else if (score < 60) {
            suggestions.add("Your resume partially matches the job requirements. Focus on incorporating the missing keywords naturally into your experience descriptions.");
        } else if (score < 80) {
            suggestions.add("Good match! Fine-tune your resume by adding the remaining missing keywords in relevant sections to boost your ATS score above 80%.");
        } else {
            suggestions.add("Excellent match! Your resume aligns well with this position. Consider minor refinements to perfect your application.");
        }

        if (!missingKeywords.isEmpty()) {
            String topMissing = String.join(", ",
                    missingKeywords.subList(0, Math.min(5, missingKeywords.size()))
            );
            suggestions.add("Add these high-priority missing keywords to your resume: " + topMissing + ".");

            if (missingKeywords.size() > 5) {
                suggestions.add("Consider incorporating " + (missingKeywords.size() - 5) +
                        " additional relevant keywords from the job description into your skills and experience sections.");
            }
        }

        suggestions.add("Use strong action verbs (e.g., 'Developed', 'Implemented', 'Led', 'Optimized') at the start of each bullet point to demonstrate impact.");
        suggestions.add("Quantify your achievements wherever possible — include metrics like percentages, revenue figures, team sizes, or project timelines.");

        return suggestions.subList(0, Math.min(5, suggestions.size()));
    }
}
