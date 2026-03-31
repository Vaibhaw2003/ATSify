package com.atsify.service;

import com.atsify.model.Analysis;
import com.atsify.model.Resume;
import com.atsify.repository.AnalysisRepository;
import com.atsify.repository.ResumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for ATS scoring — keyword extraction, matching, and scoring.
 */
@Service
public class AnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final AnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final OpenAIService openAIService;

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
            "being", "have", "has", "had", "do", "does", "did", "will", "would",
            "could", "should", "may", "might", "shall", "can", "need", "must",
            "it", "its", "this", "that", "these", "those", "i", "we", "you", "he",
            "she", "they", "me", "him", "her", "us", "them", "my", "your", "his",
            "our", "their", "what", "which", "who", "whom", "where", "when", "why",
            "how", "all", "each", "every", "both", "few", "more", "most", "other",
            "some", "such", "no", "not", "only", "own", "same", "so", "than", "too",
            "very", "just", "about", "above", "after", "again", "also", "as", "if",
            "into", "over", "under", "up", "out", "off", "then", "once", "here",
            "there", "any", "new", "old", "well", "etc", "using", "used", "work",
            "working", "experience", "year", "years", "able", "strong", "good"
    );

    public AnalysisService(AnalysisRepository analysisRepository, ResumeRepository resumeRepository, OpenAIService openAIService) {
        this.analysisRepository = analysisRepository;
        this.resumeRepository = resumeRepository;
        this.openAIService = openAIService;
    }

    public Analysis analyzeResume(String resumeId, String jobDescription, String userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        Set<String> jdKeywords = extractKeywords(jobDescription);
        Set<String> resumeKeywords = extractKeywords(resumeText);

        List<String> matchedKeywords = jdKeywords.stream()
                .filter(resumeKeywords::contains)
                .sorted()
                .collect(Collectors.toList());

        List<String> missingKeywords = jdKeywords.stream()
                .filter(keyword -> !resumeKeywords.contains(keyword))
                .sorted()
                .collect(Collectors.toList());

        double score = jdKeywords.isEmpty() ? 0.0 :
                (double) matchedKeywords.size() / jdKeywords.size() * 100.0;
        score = Math.round(score * 10.0) / 10.0;

        List<String> suggestions = openAIService.getSuggestions(
                resumeText, jobDescription, matchedKeywords, missingKeywords, score
        );

        resume.setScore(score);
        resumeRepository.save(resume);

        Analysis analysis = new Analysis();
        analysis.setResumeId(resumeId);
        analysis.setUserId(userId);
        analysis.setJobDescription(jobDescription);
        analysis.setScore(score);
        analysis.setMatchedKeywords(matchedKeywords);
        analysis.setMissingKeywords(missingKeywords);
        analysis.setSuggestions(suggestions);

        return analysisRepository.save(analysis);
    }

    private Set<String> extractKeywords(String text) {
        if (text == null || text.isBlank()) return Collections.emptySet();

        return Arrays.stream(text.toLowerCase()
                        .replaceAll("[^a-zA-Z0-9\\s+#.-]", " ")
                        .split("\\s+"))
                .map(String::trim)
                .filter(word -> word.length() > 2)
                .filter(word -> !STOP_WORDS.contains(word))
                .collect(Collectors.toSet());
    }

    public List<Analysis> getAnalysisHistory(String userId) {
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Analysis getAnalysisById(String analysisId) {
        return analysisRepository.findById(analysisId)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
    }
}
