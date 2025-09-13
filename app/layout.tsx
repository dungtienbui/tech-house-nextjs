import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/ui/app/navbar/navbar";
import Header from "@/ui/app/header/header";

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
        className={`${roboto.className} antialiased`}
      >
        <div className="h-screen">
          <Header />
          <NavBar />
          <div className="flex-grow mt-32">{children}</div>
        </div>
      </body>
    </html>
  );
}
