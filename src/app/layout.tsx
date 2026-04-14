import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "Discover Your AI Implementation Path | Beyond Seven Studios",
  description:
    "Take our 2-minute quiz and get a personalized recommendation for how to implement AI in your business.",
};

const FB_PIXEL_ID = process.env.FB_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.variable} antialiased min-h-screen`}>
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
        {children}
      </body>
    </html>
  );
}
