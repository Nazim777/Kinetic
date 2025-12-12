import React from 'react';
import { Bot, Terminal, Layers, Globe, Zap, Shield } from 'lucide-react';
import { Feature } from '../../types';

const features: Feature[] = [
  {
    title: "AI-Powered Full Stack",
    description: "Generate comprehensive React, Node, and SQL applications from a single text prompt. Our LLM understands context better than any copilot.",
    icon: Bot
  },
  {
    title: "Instant Preview Environment",
    description: "No localhost needed. Every project gets a live URL immediately. Share your progress with stakeholders in seconds.",
    icon: Globe
  },
  {
    title: "Browser-Based Terminal",
    description: "Full access to npm, pnpm, and node executables right in your browser tab. It feels like magic.",
    icon: Terminal
  },
  {
    title: "Component Library Support",
    description: "Built-in support for Tailwind, Shadcn UI, and other popular libraries to make your apps look professional instantly.",
    icon: Layers
  },
  {
    title: "Lightning Fast Builds",
    description: "Powered by Vite and optimized containers, your development experience is lag-free and responsive.",
    icon: Zap
  },
  {
    title: "Enterprise Grade Security",
    description: "Sandboxed environments ensure your local machine stays safe. Run untrusted code without fear.",
    icon: Shield
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand-500 font-semibold tracking-wide uppercase text-sm mb-3">Features</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Everything you need to build faster</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We've reimagined the development environment from the ground up, placing AI at the center of the workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-brand-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-brand-400 transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;