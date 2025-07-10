import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Bio-Harmonize',
  description: 'Winter Cleanse web app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                {children}
                <Footer />
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
