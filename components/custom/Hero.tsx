import React from 'react';
import Button from './Button';
import { ArrowRight, Play } from 'lucide-react';
import Terminal from './Terminal';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-12">
          
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-medium mb-6 animate-fade-in-up">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Build full-stack apps <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">
                at the speed of thought
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-2xl lg:max-w-none leading-relaxed">
              Prompt, run, edit, and deploy full-stack web applications directly in your browser. No setup, no config, just pure creation powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
                Start Building Free
              </Button>
              <Button variant="outline" size="lg" icon={<Play className="w-4 h-4" />} className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i} 
                    src={`https://picsum.photos/32/32?random=${i}`} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-gray-950" 
                  />
                ))}
              </div>
              <p>Trusted by 10,000+ developers</p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-purple-500/10 rounded-2xl filter blur-2xl transform rotate-3 scale-95"></div>
             <Terminal />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;