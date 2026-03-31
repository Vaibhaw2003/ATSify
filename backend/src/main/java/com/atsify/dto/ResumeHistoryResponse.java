package com.atsify.dto;

import java.util.List;

/**
 * Response DTO for resume history entries.
 */
public class ResumeHistoryResponse {
    private String id;
    private String fileName;
    private Double score;
    private String createdAt;
    private String analysisId;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> suggestions;

    public ResumeHistoryResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAnalysisId() { return analysisId; }
    public void setAnalysisId(String analysisId) { this.analysisId = analysisId; }

    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }

    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> missingKeywords) { this.missingKeywords = missingKeywords; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
