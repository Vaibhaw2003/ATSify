"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { analysisService, AnalysisData } from "@/services/api";
import {
  HiCheckCircle,
  HiXCircle,
  HiLightBulb,
  HiArrowLeft,
  HiRefresh,
  HiChartBar,
} from "react-icons/hi";

/**
 * Results page — displays ATS score, matched/missing keywords, and AI suggestions.
 */
export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      const data = await analysisService.getById(id);
      setAnalysis(data);
    } catch (error: any) {
      toast.error("Failed to load analysis");
    } finally {
      setLoading(false);
    }
  };

  /** Returns a color class based on the score value */
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-400";
    if (score >= 60) return "stroke-green-400";
    if (score >= 40) return "stroke-amber-400";
    return "stroke-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!analysis) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className="glass-card p-12 text-center max-w-md">
            <HiXCircle className="text-5xl text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
            <p className="text-slate-400 mb-6">This analysis may have been deleted or doesn&apos;t exist.</p>
            <Link href="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const score = Math.round(analysis.score);
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score / 100) * circumference;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors">
                <HiArrowLeft /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Analysis Results</h1>
            </div>
            <Link href="/upload" className="btn-primary flex items-center gap-2">
              <HiRefresh /> New Analysis
            </Link>
          </motion.div>

          {/* ===== Score Card ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Score */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64" cy="64" r="58"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64" cy="64" r="58"
                    fill="none"
                    className={getScoreRingColor(score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  <span className="text-xs text-slate-400">ATS Score</span>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-2xl font-bold mb-1 ${getScoreColor(score)}`}>
                  {getScoreLabel(score)}
                </h2>
                <p className="text-slate-400 mb-4">
                  Your resume matches {score}% of the keywords from the job description.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="glass-card !rounded-xl px-4 py-3 flex items-center gap-3">
                    <HiCheckCircle className="text-emerald-400 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-white">{analysis.matchedKeywords?.length || 0}</p>
                      <p className="text-xs text-slate-400">Matched</p>
                    </div>
                  </div>
                  <div className="glass-card !rounded-xl px-4 py-3 flex items-center gap-3">
                    <HiXCircle className="text-red-400 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-white">{analysis.missingKeywords?.length || 0}</p>
                      <p className="text-xs text-slate-400">Missing</p>
                    </div>
                  </div>
                  <div className="glass-card !rounded-xl px-4 py-3 flex items-center gap-3">
                    <HiChartBar className="text-primary text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {(analysis.matchedKeywords?.length || 0) + (analysis.missingKeywords?.length || 0)}
                      </p>
                      <p className="text-xs text-slate-400">Total Keywords</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===== Matched Keywords ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HiCheckCircle className="text-emerald-400" />
                Matched Keywords ({analysis.matchedKeywords?.length || 0})
              </h3>
              {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400
                                 text-sm font-medium border border-emerald-500/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No matched keywords found</p>
              )}
            </motion.div>

            {/* ===== Missing Keywords ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HiXCircle className="text-red-400" />
                Missing Keywords ({analysis.missingKeywords?.length || 0})
              </h3>
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400
                                 text-sm font-medium border border-red-500/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No missing keywords — great match!</p>
              )}
            </motion.div>
          </div>

          {/* ===== AI Suggestions ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mt-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HiLightBulb className="text-amber-400" />
              AI Suggestions for Improvement
            </h3>
            {analysis.suggestions && analysis.suggestions.length > 0 ? (
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 rounded-xl bg-dark/50 border border-dark-border/50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center
                                    text-xs font-bold text-white flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No suggestions available at this time</p>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
