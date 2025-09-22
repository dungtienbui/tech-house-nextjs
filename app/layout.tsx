import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/ui/components/navbar/navbar";
import Footer from "@/app/ui/components/footer/footer";
import Header from "./ui/components/header/header";

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
        <div className="h-screen">
          <Header query={""} />
          <NavBar />
          <main className="w-screen pt-40 min-[800px]:pt-32 mb-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
