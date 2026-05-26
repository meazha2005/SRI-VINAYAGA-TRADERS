import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import LayoutContent from "@/components/LayoutContent";

const greyhound = localFont({
  src: "../Greyhound Bold.ttf",
  variable: "--font-greyhound",
});

export const metadata: Metadata = {
  title: {
    default: "Sri Vinayaga Traders - Steel & Construction Materials",
    template: "%s | Sri Vinayaga Traders",
  },
  description:
    "Sri Vinayaga Traders is a trusted importer and distributor of premium steel and construction materials in Tamil Nadu. TMT Bars, Cement, Sheets, Pipes, and more.",
  keywords: [
    "steel distributor Chennai",
    "TMT bars Tamil Nadu",
    "construction materials",
    "Sri Vinayaga Traders",
    "cement distributor",
    "steel sheets",
  ],
  openGraph: {
    title: "Sri Vinayaga Traders",
    description:
      "Premium steel and construction materials distributor in Tamil Nadu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={greyhound.variable} data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <LayoutContent>{children}</LayoutContent>
        </CartProvider>
      </body>
    </html>
  );
}

