"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { resumeService, ResumeData } from "@/services/api";
import { HiPlus, HiDocumentText, HiTrendingUp, HiClock, HiChartBar } from "react-icons/hi";

/**
 * Dashboard page — shows resume analysis history and quick stats.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await resumeService.getHistory();
      setResumes(data || []);
    } catch (error: any) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const avgScore = resumes.length > 0
    ? Math.round(resumes.filter(r => r.score != null).reduce((sum, r) => sum + (r.score || 0), 0) /
        resumes.filter(r => r.score != null).length)
    : 0;

  const bestScore = resumes.length > 0
    ? Math.round(Math.max(...resumes.filter(r => r.score != null).map(r => r.score || 0)))
    : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name}</span>
              </h1>
              <p className="text-slate-400 mt-1">Here&apos;s your resume analysis overview</p>
            </div>
            <Link href="/upload" className="btn-primary flex items-center gap-2">
              <HiPlus /> New Analysis
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <HiDocumentText className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resumes.length}</p>
                <p className="text-sm text-slate-400">Resumes Analyzed</p>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <HiChartBar className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore}%</p>
                <p className="text-sm text-slate-400">Average Score</p>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <HiTrendingUp className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bestScore}%</p>
                <p className="text-sm text-slate-400">Best Score</p>
              </div>
            </div>
          </motion.div>

          {/* Resume History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Analysis History</h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <HiDocumentText className="text-5xl text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">No analyses yet</h3>
                <p className="text-slate-500 mb-6">Upload your first resume to get started</p>
                <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
                  <HiPlus /> Upload Resume
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume, i) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                               hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <HiDocumentText className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{resume.fileName}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <HiClock />
                          {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {resume.score != null ? (
                        <div className={`text-lg font-bold ${
                          resume.score >= 70 ? 'text-emerald-400' :
                          resume.score >= 40 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {Math.round(resume.score)}% match
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">No score</span>
                      )}

                      {resume.analysisId && (
                        <Link href={`/results/${resume.analysisId}`} className="btn-secondary text-sm !px-4 !py-2">
                          View Details
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
