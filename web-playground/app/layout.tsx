import './globals.css';

export const metadata = {
  title: 'Neon Genie Playground',
  description: 'Interactive ideation engine playground'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
