package com.atsify.repository;

import com.atsify.model.Analysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for Analysis documents.
 */
public interface AnalysisRepository extends MongoRepository<Analysis, String> {
    List<Analysis> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Analysis> findByResumeId(String resumeId);
    Optional<Analysis> findTopByResumeIdOrderByCreatedAtDesc(String resumeId);
}
