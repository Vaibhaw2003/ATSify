"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar — responsive top navigation bar with auth-conditional buttons.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center
                            shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-white">
              ATS<span className="gradient-text">ify</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/upload" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Analyze Resume
                </Link>
                <span className="text-slate-500 text-sm">
                  {user?.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm !px-4 !py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-4 !py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-lighter border-t border-dark-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="block text-slate-300 hover:text-white py-2">
                    Dashboard
                  </Link>
                  <Link href="/upload" onClick={() => setMobileOpen(false)}
                    className="block text-slate-300 hover:text-white py-2">
                    Analyze Resume
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full btn-secondary text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block text-slate-300 hover:text-white py-2">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="block btn-primary text-sm text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
