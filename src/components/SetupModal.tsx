import React, { useState } from 'react';
import { X, Send, CheckCircle, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export default function SetupModal({ isOpen, onClose, defaultMessage = '' }: SetupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage || 'Hi! I would love to have my own dedicated instance of Brain Massage LMS deployed and configured. Please send details about the setup service.');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit request.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent('Request: Done-For-You Managed Setup Service');
    const body = encodeURIComponent(`Hello Team,\n\nI want to trigger a managed setup service for my Brain Massage platform.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nBest regards,\n${name}`);
    window.location.href = `mailto:business@aiwithenoch.com?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden"
          id="setup-modal-container"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-medium text-gray-900 leading-none">Managed Instance Setup</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-900 rounded-md transition-colors"
              aria-label="Close modal"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900 block mb-1">Done-For-You Managed Setup Service</span>
                  Leave the tech stack to us. For a low, one-time fee, our team will fully deploy this open-source platform for you—handling custom domain configuration, secure Supabase database bindings, hosting environment optimization, and integrated Stripe or Mobile Money payment channels.
                </div>

                {error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="modal-name" className="text-xs font-medium text-gray-700 uppercase tracking-wider block">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="modal-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors"
                    placeholder="E.g., Sarah Jenkins"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="modal-email" className="text-xs font-medium text-gray-700 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors"
                    placeholder="sarah@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="modal-message" className="text-xs font-medium text-gray-700 uppercase tracking-wider block">
                    Special Deployment Needs or Questions
                  </label>
                  <textarea
                    id="modal-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your custom options, desired domains or targeted payment gateways..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    id="request-setup-submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 disabled:bg-gray-400 rounded-md transition-all cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Request Managed Setup</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-black" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-900">Setup Request Received!</h4>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                    We have successfully captured your deployment plan details. Our engineers will reach out to you within 24 hours.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleMailto}
                    id="send-direct-setup-email"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:border-black rounded-md transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Direct Email Back Up</span>
                  </button>

                  <button
                    onClick={() => {
                      setSuccess(false);
                      onClose();
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
                  >
                    Return to Application
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
