import './globals.css';

import { GeistSans } from 'geist/font/sans';

let title = 'Vercel';

let description =
  'Vercel combines the best developer experience with an obsessive focus on end-user performance. Our platform enables frontend teams to do their best work.';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
