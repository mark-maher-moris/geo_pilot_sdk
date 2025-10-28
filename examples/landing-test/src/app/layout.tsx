import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "../components/ClientProvider";

export const metadata: Metadata = {
  title: "Landing Test",
  description: "Simple landing page built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
