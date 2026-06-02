import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PricingProps {
  userSubscription: 'none' | 'day_pass' | 'monthly';
  onPaymentSuccess: (updatedUser: any) => void;
  token: string | null;
  onShowToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Pricing({ userSubscription, onPaymentSuccess, token, onShowToast }: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<'day_pass' | 'monthly' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'day_pass' as const,
      name: '1-Day Access Pass',
      price: '$2',
      period: '24 hours',
      tagline: 'Ideal for rapid neurological reset',
      features: [
        '24-Hour full-fidelity audio streaming',
        'Direct access to Theta, Alpha, and Delta waves',
        'Physical Binaural offset tuning controls',
        'Zero advertisements or interruptions',
        'Support future open-source developments'
      ]
    },
    {
      id: 'monthly' as const,
      name: 'Monthly Membership',
      price: '$25',
      period: 'month',
      tagline: 'Perfect for regular deep-work athletes',
      features: [
        'Continuous access across all mobile & desktop screens',
        'Unlimited access to premium Gamma and Solfeggio waves',
        'Interactive customizable frequency synthesizer',
        'Priority support and custom configuration assistance',
        'Unlock custom Admin Audio track uploads'
      ]
    }
  ];

  const handleCheckoutInit = (planId: 'day_pass' | 'monthly') => {
    if (!token) {
      if (onShowToast) {
        onShowToast("Please log in or register before signing up for a subscription pass.", 'error');
      } else {
        alert("Please log in or register before signing up for a subscription pass.");
      }
      return;
    }
    setSelectedPlan(planId);
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!cardNumber || !expiry || !cvv || !cardName) {
      setError('Please fill out all card details.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: selectedPlan })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to authorize payment simulator.');
      }

      onPaymentSuccess(data.user);
      setSelectedPlan(null);
      if (onShowToast) {
        onShowToast(data.message || 'Payment authorized successfully!', 'success');
      } else {
        alert(data.message || 'Payment authorized successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12" id="pricing-passes-view">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display">Pricing Passes</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          The core repository is open-source. For our cloud-hosted platform, we provide secure, high-fidelity passes to offset cloud bandwidth costs.
        </p>

        {userSubscription !== 'none' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-800 font-mono">
            <span>● Status: Active {userSubscription === 'day_pass' ? '1-Day Access' : 'Monthly Premium'}</span>
          </div>
        )}
      </div>

      {/* 2-Column Pricing Pass display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((p) => {
          const isUserActivePlan = userSubscription === p.id;
          return (
            <div
              key={p.id}
              className={`border rounded-xl p-8 bg-white flex flex-col justify-between h-[520px] transition-all relative ${
                isUserActivePlan ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-black'
              }`}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{p.name}</h3>
                    {p.id === 'monthly' && (
                      <span className="text-[10px] font-mono bg-black text-white px-2.5 py-1 rounded">Popular</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{p.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1.5 border-b border-gray-100 pb-4">
                  <span className="text-3xl font-light text-gray-900">{p.price}</span>
                  <span className="text-xs text-gray-500">/ {p.period}</span>
                </div>

                {/* Features list */}
                <ul className="space-y-3">
                  {p.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => handleCheckoutInit(p.id)}
                  disabled={isUserActivePlan}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-md transition-all text-center cursor-pointer ${
                    isUserActivePlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                  id={`purchase-btn-${p.id}`}
                >
                  {isUserActivePlan ? 'Plan Active' : 'Acquire Access Pass'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal Simulation */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" id="checkout-modal-overlay">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white border border-gray-200 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-800" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">Secure Payment Gateway</span>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-xs text-gray-400 hover:text-black hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-800" />
                <div className="text-xs text-gray-600 leading-normal">
                  You are purchasing <strong className="text-gray-900 font-medium">"{selectedPlan === 'day_pass' ? '1-Day Access Pass' : 'Monthly Membership'}"</strong>. This is a sandbox testing environment, enter dummy credit details.
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 p-2.5 bg-red-50 border border-red-100 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Name on Card</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Sarah Jenkins"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:border-black focus:outline-none bg-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:border-black focus:outline-none bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="12/28"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:border-black focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">CVC Security Code</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:border-black focus:outline-none bg-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="checkout-confirm-btn"
                  className="w-full mt-4 bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded text-xs transition-colors cursor-pointer text-center"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Authorize Payment Sim & Unlock</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
