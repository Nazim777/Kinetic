import React from 'react';
import Button from './Button';
import { Check } from 'lucide-react';
import { PricingTier } from '../../types';

const tiers: PricingTier[] = [
  {
    name: "Hobby",
    price: "$0",
    description: "Perfect for experimenting and building small tools.",
    features: [
      "Unlimited Public Projects",
      "50 AI Messages / month",
      "Community Support",
      "Basic Terminal Access"
    ]
  },
  {
    name: "Pro",
    price: "$20",
    description: "For serious builders and freelancers.",
    highlighted: true,
    features: [
      "Unlimited Private Projects",
      "Unlimited AI Messages",
      "Priority Support",
      "Super-fast Container Boots",
      "Custom Domains"
    ]
  },
  {
    name: "Team",
    price: "$50",
    description: "Collaborate with your team in real-time.",
    features: [
      "Everything in Pro",
      "Shared Workspaces",
      "Admin Controls",
      "Audit Logs",
      "SSO Integration"
    ]
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-950 relative overflow-hidden">
       {/* Decorative bg */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-900/20 filter blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.highlighted 
                  ? 'bg-gray-900 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 scale-105 z-10' 
                  : 'bg-gray-900/50 border border-gray-800 hover:bg-gray-900 transition-colors'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-400 text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.highlighted ? 'primary' : 'outline'} 
                className="w-full"
              >
                {tier.name === 'Hobby' ? 'Start Building' : 'Subscribe Now'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;