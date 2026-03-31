"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { resumeService, analysisService } from "@/services/api";
import { HiCloudUpload, HiDocumentText, HiX, HiArrowRight, HiSparkles } from "react-icons/hi";

/**
 * Upload page — drag-and-drop resume upload + job description input.
 * Combines upload + analysis in a single workflow.
 */
export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  // Drag-and-drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      if (!validTypes.includes(f.type)) {
        toast.error("Only PDF and DOCX files are supported");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFile(f);
      toast.success(`${f.name} selected`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    try {
      // Step 1: Upload the resume
      setUploading(true);
      const resume = await resumeService.upload(file);
      toast.success("Resume uploaded successfully!");

      // Step 2: Analyze against job description
      setUploading(false);
      setAnalyzing(true);
      const analysis = await analysisService.analyze(resume.id, jobDescription);
      toast.success(`Analysis complete! Score: ${Math.round(analysis.score)}%`);

      // Navigate to results
      router.push(`/results/${analysis.id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const isProcessing = uploading || analyzing;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-16 px-4">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Analyze Your <span className="gradient-text">Resume</span>
              </h1>
              <p className="text-slate-400">Upload your resume and paste the job description to get your ATS score</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ===== Upload Box ===== */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiCloudUpload className="text-primary" /> Upload Resume
                </h2>

                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                               transition-all duration-300 ${
                                 isDragActive
                                   ? "border-primary bg-primary/5"
                                   : "border-dark-border hover:border-primary/50"
                               }`}
                  >
                    <input {...getInputProps()} />
                    <HiCloudUpload className="text-5xl text-slate-500 mx-auto mb-4" />
                    {isDragActive ? (
                      <p className="text-primary-light font-medium">Drop your resume here...</p>
                    ) : (
                      <>
                        <p className="text-slate-300 font-medium mb-1">Drag & drop your resume here</p>
                        <p className="text-sm text-slate-500">or click to browse • PDF, DOCX • Max 10MB</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="border border-dark-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <HiDocumentText className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <HiX />
                    </button>
                  </div>
                )}
              </div>

              {/* ===== Job Description ===== */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiSparkles className="text-accent" /> Job Description
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here...

Example:
We are looking for a Senior Frontend Developer with experience in React, TypeScript, and Node.js..."
                  rows={10}
                  className="input-field resize-none h-[200px]"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {jobDescription.length} characters
                </p>
              </div>
            </div>

            {/* ===== Analyze Button ===== */}
            <div className="mt-8 text-center">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing || !file || !jobDescription.trim()}
                className="btn-primary text-lg !px-10 !py-4 inline-flex items-center gap-3
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploading ? "Uploading Resume..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    Analyze Resume <HiArrowRight />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
