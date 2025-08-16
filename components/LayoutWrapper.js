"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide navbar on auth-related pages
  const hideNavbar = pathname.startsWith('/login') || 
                     pathname.startsWith('/signup') || 
                     pathname.startsWith('/forgot-password');

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}