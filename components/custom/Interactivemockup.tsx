import React, { useState } from 'react';
import { FileCode, Layout, Code, Eye, RefreshCw, Send, Maximize2 } from 'lucide-react';

const InteractiveMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if(!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt("");
    }, 2000);
  };

  return (
    <section id="demo" className="py-24 bg-gray-900/50 border-y border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">A complete IDE in your browser</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Forget about local environment setup. BoltClone gives you a VS Code-like environment, 
            a terminal, and an instant preview server, all orchestrated by AI.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-2xl ring-1 ring-white/10 flex flex-col md:flex-row h-[600px]">
          
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-950/50">
            <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Explorer</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-brand-400 bg-brand-500/10 p-2 rounded cursor-pointer">
                  <FileCode className="w-4 h-4 mr-2" />
                  App.tsx
                </li>
                <li className="flex items-center text-gray-400 hover:text-white p-2 rounded cursor-pointer hover:bg-white/5">
                  <FileCode className="w-4 h-4 mr-2" />
                  main.css
                </li>
                 <li className="flex items-center text-gray-400 hover:text-white p-2 rounded cursor-pointer hover:bg-white/5">
                  <FileCode className="w-4 h-4 mr-2" />
                  types.ts
                </li>
              </ul>
            </div>
            <div className="mt-auto p-4 border-t border-gray-800">
               <div className="text-xs text-gray-600">Connected to BoltNet v2</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50">
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Code className="w-4 h-4 inline mr-1" /> Code
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye className="w-4 h-4 inline mr-1" /> Preview
                </button>
              </div>
              <div className="flex items-center space-x-2">
                 <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"><RefreshCw className="w-4 h-4" /></button>
                 <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"><Maximize2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 overflow-hidden relative bg-gray-950">
              {activeTab === 'code' ? (
                <div className="p-6 font-mono text-sm text-gray-300 overflow-auto h-full">
                  <div className="text-gray-500">import</div> <span className="text-purple-400">React</span> <div className="text-gray-500">from</div> <span className="text-green-400">'react'</span>;<br/>
                  <br/>
                  <div className="text-blue-400">const</div> <span className="text-yellow-400">App</span> = () =&gt; &#123;<br/>
                  &nbsp;&nbsp;<div className="text-blue-400">return</div> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">div</span> <span className="text-purple-400">className</span>=<span className="text-green-400">"min-h-screen bg-black text-white"</span>&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">h1</span>&gt;Hello World&lt;/<span className="text-red-400">h1</span>&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">div</span>&gt;<br/>
                  &nbsp;&nbsp;);<br/>
                  &#125;;<br/>
                  <br/>
                  <div className="text-gray-500">// AI generated code below...</div>
                </div>
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center relative">
                   {/* Mock App Output */}
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center text-gray-900">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-brand-500 rounded-2xl mx-auto mb-4 shadow-xl flex items-center justify-center">
                          <Layout className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">Landing Page V1</h1>
                        <p className="text-gray-600">Generated by BoltClone</p>
                        <button className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                           Click Me
                        </button>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* AI Prompt Bar */}
            <div className="h-auto min-h-[60px] border-t border-gray-800 p-4 bg-gray-900 flex items-center">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Bolt to change something (e.g., 'Make the button purple')"
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-brand-500 border border-gray-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button 
                  onClick={handleGenerate}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-all ${prompt ? 'bg-brand-500 text-white' : 'bg-gray-700 text-gray-500'}`}
                >
                  <Send className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InteractiveMockup;