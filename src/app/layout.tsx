import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Scripts from "@/components/layout/Scripts";
import { site, ogImages } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Free Online Tools for Images, PDFs & Calculators | ${site.name}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  category: "technology",
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", images: ogImages },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "32x32" }], apple: "/apple-touch-icon.png" },
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0c" },
  ],
};

// Google tag (Tag Manager container) with Consent Mode v2: everything starts "denied"; the cookie
// banner sends a consent "update" to "granted" only after the visitor clicks Accept.
const gtmScript = site.gtmId
  ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;` +
    `gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});` +
    `try{if(localStorage.getItem('fth-consent')==='granted')gtag('consent','update',{analytics_storage:'granted'})}catch(e){}` +
    `gtag('js',new Date());`
  : "";

const themeScript = `try{var t=localStorage.getItem('fth-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        {site.gtmId && (
          <>
            <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
            <script async src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(site.gtmId)}`} />
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
