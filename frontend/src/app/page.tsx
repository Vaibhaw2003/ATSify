"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight, HiDocumentSearch, HiLightningBolt, HiChartBar, HiSparkles, HiShieldCheck, HiClock } from "react-icons/hi";

/**
 * Landing page — Hero, Features, How It Works, and CTA sections.
 */
export default function HomePage() {
  return (
    <div className="pt-16">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                               bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-8">
                <HiSparkles className="text-accent" />
                AI-Powered Resume Analysis
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            >
              Boost Your Resume{" "}
              <span className="gradient-text">ATS Score</span>{" "}
              Instantly 🚀
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
            >
              Upload your resume. Paste a job description. Get an instant ATS compatibility
              score with AI-powered suggestions to land more interviews.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register" className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2">
                Get Started Free <HiArrowRight />
              </Link>
              <Link href="#features" className="btn-secondary text-lg !px-8 !py-4">
                See How It Works
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { label: "Resumes Analyzed", value: "10K+" },
                { label: "Avg. Score Boost", value: "+35%" },
                { label: "User Satisfaction", value: "98%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Beat the ATS</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI analyzes your resume against job descriptions and provides actionable insights
              to maximize your chances of getting past automated screening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <HiDocumentSearch className="text-3xl" />,
                title: "Smart Resume Parsing",
                desc: "Upload PDF or DOCX resumes. Our parser extracts every detail using Apache Tika for accurate text analysis.",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: <HiChartBar className="text-3xl" />,
                title: "ATS Score Analysis",
                desc: "Get a precise compatibility score showing how well your resume matches the job description's keywords.",
                color: "from-primary to-accent",
              },
              {
                icon: <HiSparkles className="text-3xl" />,
                title: "AI Suggestions",
                desc: "Receive AI-powered recommendations to improve your bullet points, add missing skills, and boost your score.",
                color: "from-purple-500 to-pink-400",
              },
              {
                icon: <HiLightningBolt className="text-3xl" />,
                title: "Instant Results",
                desc: "Get your ATS score and detailed analysis in seconds, not minutes. Iterate quickly and improve fast.",
                color: "from-amber-500 to-orange-400",
              },
              {
                icon: <HiShieldCheck className="text-3xl" />,
                title: "Keyword Matching",
                desc: "See exactly which keywords are matched and missing, so you know precisely what to add to your resume.",
                color: "from-emerald-500 to-teal-400",
              },
              {
                icon: <HiClock className="text-3xl" />,
                title: "Score History",
                desc: "Track your progress over time. See how your improvements translate to higher ATS scores across analyses.",
                color: "from-rose-500 to-red-400",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color}
                                 flex items-center justify-center text-white mb-4
                                 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">
              How <span className="gradient-text">ATSify</span> Works
            </h2>
            <p className="text-slate-400">Three simple steps to optimize your resume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Resume", desc: "Drag and drop your PDF or DOCX resume file." },
              { step: "02", title: "Paste Job Description", desc: "Add the job description you want to match against." },
              { step: "03", title: "Get Results", desc: "Receive your ATS score, keyword analysis, and AI suggestions." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto
                                flex items-center justify-center text-2xl font-bold text-white mb-6
                                shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Boost Your ATS Score</span>?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who have improved their resumes with ATSify.
              Start analyzing for free today.
            </p>
            <Link href="/register" className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2">
              Start Free Analysis <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-dark-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-sm text-slate-400">
              © 2024 ATSify. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
