import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/ui/components/footer/footer";
import Header from "@/ui/components/header/header";
import NavBar from "@/ui/components/navbar/navbar";
import { Providers } from "./providers";
import TestAuth from "./test-auth";

const roboto = Roboto({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Tech house",
    template: "%s | Tech house"
  },
  description: "Website sells technology devices.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en">
      <body
        className={`${roboto.className} antialiased bg-slate-50`}
      >
        <Providers>
          <div className="h-screen">
            <TestAuth />
            <Header />
            <NavBar />
            <main className="w-screen mb-5">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
