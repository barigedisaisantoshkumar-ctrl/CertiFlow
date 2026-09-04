import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('director@thehps.in');
  const [password, setPassword] = useState('AdminHPS#2026');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      try {
        login(email, password);
        setIsLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Invalid email or password.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Decorative Brand Background Highlights */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 shadow-xl shadow-brand-500/30 mb-4">
            <img src="/favicon.png" alt="CertiFlow Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Certi<span className="text-brand-500">Flow</span> Admin
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Internship Certificate Management & Issuance Portal
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xl shadow-slate-200/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <Input
              label="Company Email"
              type="email"
              placeholder="director@thehps.in"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Row Level Security Active
            </span>
            <span>v1.0 MVP</span>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Authorized internal company access only. Unauthenticated verifiers can verify public certificates without logging in.
        </p>
      </div>
    </div>
  );
}
