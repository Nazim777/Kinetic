'use client'
import  Header  from "@/components/custom/Header";
import  Hero  from "@/components/custom/Hero";
import InteractiveMockup from "@/components/custom/Interactivemockup";
import Features from "@/components/custom/Features";
import Pricing from "@/components/custom/Pricing";
import Footer from "@/components/custom/Footer";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-brand-500/30 selection:text-white">
      <Header />
      <main>
        <Hero />
        <InteractiveMockup />
        <Features />
        <Pricing />
        
        {/* Call to Action Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-600"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to build your dream app?</h2>
             <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
               Join thousands of developers who are shipping faster than ever before.
               No credit card required.
             </p>
             <button className="bg-white text-brand-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-50 transition-colors shadow-2xl">
               Get Started for Free
             </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
