import "./globals.css";
import { Suspense } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning={true}>
      <body
        className={`antialiased`}
      >
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
