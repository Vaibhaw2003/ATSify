package com.atsify.service;

import com.atsify.model.Resume;
import com.atsify.repository.ResumeRepository;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Service for resume upload, text extraction, and history retrieval.
 */
@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final Tika tika = new Tika();

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    /**
     * Upload and parse a resume file.
     */
    public Resume uploadResume(MultipartFile file, String userId) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("application/pdf") &&
                 !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                 !contentType.equals("application/msword"))) {
            throw new RuntimeException("Only PDF and DOCX files are supported");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String extractedText = extractText(file);

        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileUrl(filePath.toString());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    private String extractText(MultipartFile file) {
        try (InputStream stream = file.getInputStream()) {
            return tika.parseToString(stream);
        } catch (Exception e) {
            log.error("Failed to extract text from file: {}", e.getMessage());
            throw new RuntimeException("Failed to extract text from resume: " + e.getMessage());
        }
    }

    public List<Resume> getResumeHistory(String userId) {
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Resume getResumeById(String resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }
}
