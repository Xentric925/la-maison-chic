import { Inter } from 'next/font/google';
import '@/styles/globals.scss';

import { cn } from '@/lib/utils';
import Layout from '@/components/global/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

type RootLayoutPropTypes = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutPropTypes>) => {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
        )}
      >
        <AuthProvider>
          <Layout>{children}</Layout>
          <Toaster></Toaster>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
