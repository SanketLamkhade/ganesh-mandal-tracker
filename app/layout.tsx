import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/AuthProvider";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import { authOptions } from "@/lib/auth";
import { APP, getAppUrl, MANDAL } from "@/lib/constants";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: `${MANDAL.name} | Collection Tracker`,
  description: APP.description,
  applicationName: APP.shortName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/Ganpati_Splash_screen.png", sizes: "768x1376", type: "image/png" },
    ],
    apple: [
      {
        url: "/Ganpati_Splash_screen.png",
        sizes: "768x1376",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: APP.shortName,
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/Ganpati_Splash_screen.png",
        media: "(orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#5C1515",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-foreground antialiased">
        <AuthProvider session={session}>
          {children}
          <InstallPrompt />
          <ServiceWorkerRegistrar />
        </AuthProvider>
      </body>
    </html>
  );
}
