import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Terminal, Copy, Check, Github } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onAuthSuccess: (user: any, token: string) => void;
  openSetupModal: (msg: string) => void;
  onShowToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function Auth({ onAuthSuccess, openSetupModal, onShowToast }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Help developer copy-paste
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        console.error('Server non-JSON response:', rawText);
        throw new Error(`Server returned non-JSON response: ${rawText.slice(0, 180)}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Authentication failed. Please check parameters.');
      }

      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setError('');
    // Switch to login page to reveal the credential fields
    setIsLogin(true);
    // Autofill with public test credentials
    setEmail('admin@brainmassage.co');
    setPassword('adminpassword');
    
    if (onShowToast) {
      onShowToast("Google authentication is simulated. We've autofilled the public tester credentials for you above!", "success");
    } else {
      setError("Google authentication is simulated. We have loaded the public credentials: admin@brainmassage.co with password adminpassword.");
    }
  };

  const dbMigrationDoc = `-- SUPABASE TABLE SCHEMAS
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  subscription_status text DEFAULT 'none',
  expires_at timestamptz
);

CREATE TABLE tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  frequency text,
  category text,
  premium boolean DEFAULT true,
  audio_url text,
  created_at timestamptz DEFAULT now()
);`;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white" id="auth-split-screen">
      
      {/* Left Column: Tech Stack & Open-Source Specs */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="space-y-6">
          <button
            onClick={() => window.open('https://github.com/aiwithenoch/brainmassage', '_blank')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            <Github className="w-5 h-5 text-gray-900" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-900 hover:underline">Open-Source Core Repository v1.2</span>
          </button>

          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-gray-900">
              Direct-to-Supabase Self-Hosting
            </h1>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              This repository is fully distributed under the Apache-2.0 License. You have complete rights to clone, customize, and spin up your own self-hosted audio streaming infrastructure.
            </p>
          </div>

          {/* Code block */}
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 bg-gray-950 p-2 px-4 rounded-t-md border-b border-gray-800">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-gray-400" /> supabase_schema.sql</span>
              <button
                type="button"
                onClick={() => copyToClipboard(dbMigrationDoc, 'schema')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {copiedText === 'schema' ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-b-md bg-gray-950 text-gray-300 font-mono text-[11px] leading-relaxed overflow-x-auto border border-gray-900 max-h-72">
              <code>{dbMigrationDoc}</code>
            </pre>
          </div>

          <div className="space-y-2 text-sm text-gray-600 leading-relaxed max-w-md">
            <span className="font-semibold text-gray-900 block">Deploying in 5 minutes:</span>
            <ul className="list-decimal list-inside space-y-1 text-xs text-gray-500">
              <li>Deploy frontend statically on Netlify, Vercel, or Cloud Run.</li>
              <li>Instantiate a free PostgreSQL Supabase instance.</li>
              <li>Toggle Row Level Security (RLS) tables.</li>
              <li>Configure custom Stripe webhooks for access control billing passes.</li>
            </ul>
          </div>
        </div>

        {/* Footer info triggering the Modal */}
        <div className="pt-8 border-t border-gray-200">
          <div className="p-4 bg-white border border-gray-200 rounded-lg max-w-md">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-950 block mb-1">Non-Technical? Leave it to us.</strong>
              If you aren't comfortable with Docker, database scripts, or API configurations, we will establish Your Custom Copy of this entire application for a low, flat setup fee.
            </p>
            <button
              onClick={() => openSetupModal('Hello, I am looking for a full custom setup of Brain Massage LMS on my domain.')}
              id="auth-managed-setup-trigger"
              className="mt-3 text-xs font-medium text-black hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Request Managed Setup Service →
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Authentication Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 max-w-fit px-4 text-xs font-mono tracking-widest text-gray-900 font-semibold uppercase leading-none">
              ~ 4 Hz
            </div>
            <h2 className="text-xl font-medium tracking-tight text-gray-900">
              {isLogin ? 'Enter Streaming Room' : 'Create Free Student Account'}
            </h2>
            <p className="text-xs text-gray-500">
              {isLogin ? 'Connect securely to access spatial frequency tracks' : 'Host your profiles and log user play progress metrics'}
            </p>

            {/* Public Demo Credentials Banner */}
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 text-left space-y-1 shadow-sm">
              <span className="font-bold text-amber-950 block">✨ Public Testing Access Credentials:</span>
              <div>
                <span className="font-semibold text-gray-700">Email:</span> <code className="bg-white/80 px-1 py-0.5 rounded font-mono select-all">admin@brainmassage.co</code>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Password:</span> <code className="bg-white/80 px-1 py-0.5 rounded font-mono select-all">adminpassword</code>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-xs font-medium text-gray-700 uppercase tracking-wider block">
                  Your Name
                </label>
                <input
                  type="text"
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors"
                  placeholder="Sarah Jenkins"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="auth-email" className="text-xs font-medium text-gray-700 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="email"
                id="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors"
                placeholder="you@domain.com"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="auth-password" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast("Self-hosted deployments can reset passwords in the Supabase Users table. To reset client demos, register a new account on this screen.", "info");
                      } else {
                        alert("Self-hosted deployments can reset passwords in the Supabase Users table. To reset client demos, register a new account on this screen.");
                      }
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="auth-primary-submit-btn"
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-md transition-colors duration-150 cursor-pointer text-center"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>{isLogin ? 'Sign In and Load Player' : 'Register New Account'}</span>
              )}
            </button>
          </form>

          {/* Social OAuth Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-mono">Or Use External Credentials</span>
            </div>
          </div>

          <button
            onClick={handleGoogleOAuth}
            id="google-oauth-btn"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-black rounded-md transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Sign In with Google Security</span>
          </button>

          {/* Prompt Toggle */}
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              id="toggle-auth-mode"
              className="text-xs text-gray-500 hover:text-black hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up statically" : "Already registered? Return to login"}
            </button>
          </div>

          {/* Tech stack disclaimer */}
          <p className="text-[10px] text-center text-gray-400 leading-relaxed pt-4 border-t border-gray-100">
            For local-host development, default administrator login is:<br />
            <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-gray-600">admin@brainmassage.co</span> with password <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-gray-600 font-semibold">adminpassword</span>
          </p>

        </div>
      </div>

    </div>
  );
}
