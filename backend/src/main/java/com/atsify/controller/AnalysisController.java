package com.atsify.controller;

import com.atsify.dto.AnalysisResponse;
import com.atsify.dto.ApiResponse;
import com.atsify.model.Analysis;
import com.atsify.model.User;
import com.atsify.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * REST controller for ATS resume analysis.
 */
@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse> analyzeResume(
            @RequestParam("resumeId") String resumeId,
            @RequestParam("jobDescription") String jobDescription,
            @AuthenticationPrincipal User user
    ) {
        Analysis analysis = analysisService.analyzeResume(resumeId, jobDescription, user.getId());
        AnalysisResponse response = toResponse(analysis);
        return ResponseEntity.ok(ApiResponse.success("Analysis complete", response));
    }

    @GetMapping("/analysis/history")
    public ResponseEntity<ApiResponse> getAnalysisHistory(@AuthenticationPrincipal User user) {
        List<Analysis> analyses = analysisService.getAnalysisHistory(user.getId());

        List<AnalysisResponse> responses = new ArrayList<>();
        for (Analysis analysis : analyses) {
            responses.add(toResponse(analysis));
        }

        return ResponseEntity.ok(ApiResponse.success("Analysis history retrieved", responses));
    }

    @GetMapping("/analysis/{id}")
    public ResponseEntity<ApiResponse> getAnalysis(@PathVariable String id) {
        Analysis analysis = analysisService.getAnalysisById(id);
        AnalysisResponse response = toResponse(analysis);
        return ResponseEntity.ok(ApiResponse.success("Analysis retrieved", response));
    }

    /** Helper to convert Analysis model to AnalysisResponse DTO */
    private AnalysisResponse toResponse(Analysis analysis) {
        AnalysisResponse resp = new AnalysisResponse();
        resp.setId(analysis.getId());
        resp.setResumeId(analysis.getResumeId());
        resp.setScore(analysis.getScore());
        resp.setMatchedKeywords(analysis.getMatchedKeywords());
        resp.setMissingKeywords(analysis.getMissingKeywords());
        resp.setSuggestions(analysis.getSuggestions());
        resp.setCreatedAt(analysis.getCreatedAt() != null ? analysis.getCreatedAt().toString() : null);
        return resp;
    }
}
