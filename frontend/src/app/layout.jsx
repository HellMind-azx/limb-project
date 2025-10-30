import '../styles/globals.scss';
import '../styles/polygon.scss';
import Navbar from '@/components/Navbar'; 
import WithSidebar from '@/components/WithSidebar';

export const metadata = {
  title: 'Progressor - Self Development Tracker',
  description: 'Track your habits and personal growth journey with our intelligent habit tracking platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <WithSidebar>{children}</WithSidebar>
      </body>
    </html>
  );
}
