import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./provider";
import Navbar from "@/components/Navbar";
import HelpComponent from "@/components/HelpModal";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

// ✅ Define metadata for SEO (Next.js 13+ App Router)
export const metadata = {
  title:
    "GetJobs.today | Find Remote, Onsite, Tech, Design, Marketing Jobs and More",
  description:
    "Discover top remote and onsite jobs in tech, design, marketing, finance, and more. GetJobs.today connects job seekers with leading companies hiring talent.",
  keywords:
    "job search, hiring now, remote jobs, onsite jobs, tech jobs, design jobs, marketing jobs, IT jobs, engineering jobs, digital marketing jobs, startup jobs, freelance jobs, full-time jobs, part-time jobs, career opportunities",
  robots: "index, follow",
  authors: [{ name: "GetJobs.today" }],
  openGraph: {
    siteName: "GetJobs.today",
    url: "https://getjobs.today/",
    type: "website",
    images: ["/images/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GetJobs.today | Find Remote, Onsite, Tech, Design, Marketing Jobs and More",
    description:
      "Find remote and onsite jobs in development, design, finance, and engineering. GetJobs.today helps job seekers connect with top employers.",
    images: ["/images/favicon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="bg-zinc-50 w-full min-h-screen">
            <div className="relative max-w-[72rem] mx-auto">
              <Toaster />
              <Navbar />
              {children}
              <HelpComponent />
            </div>
            <Footer />
          </main>
        </AuthProvider>

        {/* ✅ Ahrefs Analytics Script */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="55Ya04Gl3i+OBNXtOBawdA"
          strategy="afterInteractive"
        />

        {/* ✅ Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-S3V1MYKXW3"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S3V1MYKXW3');`}
        </Script>
      </body>
    </html>
  );
}
