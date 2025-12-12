import React from 'react';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-brand-500 p-1.5 rounded-lg">
                <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">BoltClone</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering developers to build the future with AI. Code less, create more.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} BoltClone Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;