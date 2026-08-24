import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Caldas Ready to Invest", template: "%s · Caldas Ready to Invest" },
  description: "Auscultação ao ecossistema económico para o Kit do Investidor das Caldas da Rainha.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Caldas Ready to Invest",
    description: "Auscultação ao ecossistema económico",
    type: "website",
    locale: "pt_PT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Caldas Ready to Invest" }],
  },
  twitter: { card: "summary_large_image", title: "Caldas Ready to Invest", description: "Auscultação ao ecossistema económico", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt"><body>{children}</body></html>;
}
