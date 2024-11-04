import type { Metadata } from "next";
import "./globals.css";
import {
    QueryClient,
} from '@tanstack/react-query'
import {AppWrapper} from "@/app/AppWrapper";
import { ThemeProvider } from "@/components/theme-provider"


import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
 
import { cn } from "@/lib/utils"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 

export const metadata: Metadata = {
  title: "Dashboard | Produx",
  description: "Dashboard of produx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const queryClient = new QueryClient()
  return (
      <AppWrapper>
      <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              overflow-x: hidden !important;
            }
          `}

        </style>
      </head>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
      </AppWrapper>
  );
}
