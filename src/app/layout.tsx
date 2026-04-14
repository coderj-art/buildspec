import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const rethinkSans = localFont({
  src: [
    { path: "../../public/fonts/RethinkSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/RethinkSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/RethinkSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/RethinkSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/RethinkSans-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-rethink",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "BuildSpec — Your first Claude Code build, sized to you",
  description:
    "Answer 10 questions. Get a personalised one-page spec for the exact tool you should build first with Claude Code. Plus a 22-day build plan to your inbox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rethinkSans.variable} ${cormorant.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}