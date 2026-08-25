import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Caldas Ready to Invest", template: "%s · Caldas Ready to Invest" },
  description: "Diagnóstico e auscultação para a futura implementação do Kit do Investidor das Caldas da Rainha.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Caldas Ready to Invest",
    description: "Diagnóstico e auscultação para o futuro Kit do Investidor",
    type: "website",
    locale: "pt_PT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Caldas Ready to Invest" }],
  },
  twitter: { card: "summary_large_image", title: "Caldas Ready to Invest", description: "Diagnóstico e auscultação para o futuro Kit do Investidor", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
