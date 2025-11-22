import '../styles/globals.scss';
import '../styles/polygon.scss';
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WithSidebar from '@/components/WithSidebar';

export const metadata = {
  title: 'Progressor - Self Development Tracker',
  description: 'Track your habits and personal growth journey with our intelligent habit tracking platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <WithSidebar>{children}</WithSidebar>
      </body>
    </html>
  );
}
