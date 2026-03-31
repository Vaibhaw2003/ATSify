package com.atsify.controller;

import com.atsify.dto.ApiResponse;
import com.atsify.dto.ResumeHistoryResponse;
import com.atsify.model.Analysis;
import com.atsify.model.Resume;
import com.atsify.model.User;
import com.atsify.repository.AnalysisRepository;
import com.atsify.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for resume upload and history.
 */
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final AnalysisRepository analysisRepository;

    public ResumeController(ResumeService resumeService, AnalysisRepository analysisRepository) {
        this.resumeService = resumeService;
        this.analysisRepository = analysisRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) throws IOException {
        Resume resume = resumeService.uploadResume(file, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", resume));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse> getHistory(@AuthenticationPrincipal User user) {
        List<Resume> resumes = resumeService.getResumeHistory(user.getId());

        List<ResumeHistoryResponse> history = new ArrayList<>();
        for (Resume resume : resumes) {
            Optional<Analysis> latestAnalysis =
                    analysisRepository.findTopByResumeIdOrderByCreatedAtDesc(resume.getId());

            ResumeHistoryResponse resp = new ResumeHistoryResponse();
            resp.setId(resume.getId());
            resp.setFileName(resume.getFileName());
            resp.setScore(resume.getScore());
            resp.setCreatedAt(resume.getCreatedAt() != null ? resume.getCreatedAt().toString() : null);

            if (latestAnalysis.isPresent()) {
                Analysis analysis = latestAnalysis.get();
                resp.setAnalysisId(analysis.getId());
                resp.setMatchedKeywords(analysis.getMatchedKeywords());
                resp.setMissingKeywords(analysis.getMissingKeywords());
                resp.setSuggestions(analysis.getSuggestions());
            }

            history.add(resp);
        }

        return ResponseEntity.ok(ApiResponse.success("Resume history retrieved", history));
    }
}
