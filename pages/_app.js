import "@/styles/globals.css";
import { Header } from "@/components";
import Head from "next/head";
import { site_metadata } from "@/constants";
import { Toaster } from "react-hot-toast";
import { useVisitorCount } from "@/hooks";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/context";
import AdminLayout from "@/components/admin/AdminLayout";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useVisitorCount(router?.pathname || "unknown", router?.asPath);

  if (router.pathname.startsWith('/admin')) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Muhromin | Fullstack Web Developer</title>
        <meta name="title" content="Muhromin | Fullstack Web Developer" />
        <meta name="description" content="Portfolio Muhromin - Fullstack Developer dengan keahlian di React, Next.js, Node.js, Laravel, dan Golang. Siap membangun solusi web yang skalabel." />
        <meta name="keywords" content="Fullstack Developer, React, Next.js, Node.js, Laravel, Golang, Portfolio, Muhromin" />
        <meta name="author" content="Muhromin" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romifullstack.vercel.app/" />
        <meta property="og:title" content="Muhromin | Fullstack Web Developer" />
        <meta property="og:description" content="Portfolio profesional Muhromin - Spesialis React, Next.js, dan Backend Development." />
        <meta property="og:image" content="https://romifullstack.vercel.app/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://romifullstack.vercel.app/" />
        <meta property="twitter:title" content="Muhromin | Fullstack Web Developer" />
        <meta property="twitter:description" content="Portfolio profesional Muhromin - Spesialis React, Next.js, dan Backend Development." />
        <meta property="twitter:image" content="https://romifullstack.vercel.app/og-image.png" />

        {/* Canonical & Favicons */}
        <link rel="canonical" href="https://romifullstack.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="CC6bjZ45EFPO-vkaeJE8sfjrf5umq-IyAiSuhYUyfpc" />
      </Head>

      <ThemeProvider>
        <Header />
      </ThemeProvider>
      <main className="mx-4 my-16 pt-6 md:flex md:justify-center md:items-center">
        <Component {...pageProps} />
      </main>
      <Toaster />
    </>
  );
}