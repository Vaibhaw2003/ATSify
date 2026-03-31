package com.atsify.dto;

import java.util.List;

/**
 * Response DTO for ATS analysis results.
 */
public class AnalysisResponse {
    private String id;
    private String resumeId;
    private Double score;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> suggestions;
    private String createdAt;

    public AnalysisResponse() {}

    public AnalysisResponse(String id, String resumeId, Double score, List<String> matchedKeywords,
                            List<String> missingKeywords, List<String> suggestions, String createdAt) {
        this.id = id;
        this.resumeId = resumeId;
        this.score = score;
        this.matchedKeywords = matchedKeywords;
        this.missingKeywords = missingKeywords;
        this.suggestions = suggestions;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResumeId() { return resumeId; }
    public void setResumeId(String resumeId) { this.resumeId = resumeId; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }

    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> missingKeywords) { this.missingKeywords = missingKeywords; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
