package com.atsify.repository;

import com.atsify.model.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

/**
 * MongoDB repository for Resume documents.
 */
public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByUserIdOrderByCreatedAtDesc(String userId);
}
