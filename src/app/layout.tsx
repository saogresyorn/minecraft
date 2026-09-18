import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Course Hub",
  description: "เว็บเทคโนโลยี Next.js และ TypeScript พื้นฐาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  );
}