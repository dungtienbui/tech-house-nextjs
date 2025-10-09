import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/card-context";
import Footer from "@/ui/components/footer/footer";
import Header from "@/ui/components/header/header";
import NavBar from "@/ui/components/navbar/navbar";
import { GuestProvider } from "@/lib/context/guest-context";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk',
      }}
    >
      <html lang="en">
        <body
          className={`${roboto.className} antialiased bg-slate-50`}
        >
          <GuestProvider>
            <CartProvider>
              <div className="h-screen">
                <Header />
                <NavBar />
                <main className="w-screen mb-5">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </GuestProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
