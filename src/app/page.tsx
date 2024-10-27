import './global.css';
import React from 'react';
import Navbar from "../components/ui/navbar";
import Footer from '@/components/ui/Footer';
import HomePage from '@/components/pages/HomePage';

export default function Home() {
  return (
      <div>
        <Navbar/>
        <HomePage/>
        <Footer/>
      </div>
  );
}
