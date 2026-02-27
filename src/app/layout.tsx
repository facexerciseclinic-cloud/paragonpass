import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paragonpass — Beauty Clinic Value Simulator",
  description:
    "เปรียบเทียบราคาหัตถการความงาม เลือก Pass ที่คุ้มค่าที่สุดสำหรับคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
