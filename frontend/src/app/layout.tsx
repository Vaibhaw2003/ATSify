import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ATSify — AI-Powered ATS Resume Analyzer",
  description:
    "Boost your resume ATS score instantly with AI-powered analysis. Upload your resume, paste a job description, and get actionable insights.",
  keywords: "ATS, resume, analyzer, AI, job, career, keywords, score",
};

/**
 * Root layout — wraps all pages with AuthProvider, Navbar, and Toast.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1E293B",
                color: "#F8FAFC",
                border: "1px solid #334155",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#4F46E5", secondary: "#F8FAFC" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#F8FAFC" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
