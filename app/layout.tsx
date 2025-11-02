import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetic",
  description: "AI Application Builder",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kitetic",
    description: "AI Application Builder",
    images: "/favicon.ico",
    siteName: "AI Application Builder",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
       
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                  <AppSidebar />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />

                    <main className="flex-1 overflow-y-auto p-6">
                      {children}
                      <Toaster position="top-center" richColors closeButton />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </ConvexClientProvider>
       
      </body>
    </html>
  );
}
