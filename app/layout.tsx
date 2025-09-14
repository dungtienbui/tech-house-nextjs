import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/ui/app/navbar/navbar";
import Header from "@/ui/app/header-footer/header";
import Footer from "@/ui/app/header-footer/footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased bg-slate-50`}
      >
        <div className="h-screen">
          <Header />
          <NavBar />
          <div className="w-screen pt-40 min-[800px]:pt-32">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
