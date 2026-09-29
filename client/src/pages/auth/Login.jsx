import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, Mail, Lock, ArrowRight,
  CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Demo account quick-fill data ─────────────────────────────── */
const DEMO_ACCOUNTS = [
  {
    role: 'Student',
    emoji: '🎓',
    email: 'student@campus.edu',
    password: 'student123',
    hint: 'Any email — e.g. abc@gmail.com',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-800',
    dot: 'bg-indigo-500',
  },
  {
    role: 'Faculty',
    emoji: '👨‍🏫',
    email: 'faculty@campus.edu',
    password: 'faculty123',
    hint: 'Institutional — e.g. prof@college.edu',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
  },
  {
    role: 'Admin',
    emoji: '⚙️',
    email: 'admin@campus.edu',
    password: 'admin123',
    hint: 'Admin email — e.g. admin@campus.edu',
    color: 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-800',
    dot: 'bg-rose-500',
  },
];

const Login = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPwd]  = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) navigate('/');
  };

  const quickFill = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    toast.success(`${account.emoji} ${account.role} credentials filled!`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">

      {/* ── Left hero panel ── */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 rounded-full bg-purple-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-10 h-10 text-indigo-300" />
            <span className="text-2xl font-bold tracking-tight">Smart Campus Hub</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Your academic life,{' '}
            <span className="text-indigo-300">simplified.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-md">
            Access courses, events, resources, and announcements all in one integrated platform.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4 text-indigo-100">
          {[
            'Real-time campus announcements',
            'Register for events & manage schedule',
            'Book campus resources & facilities',
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}

          {/* Role email format guide */}
          <div className="mt-8 pt-6 border-t border-indigo-700">
            <p className="text-indigo-300 text-sm font-semibold mb-3 uppercase tracking-wider">
              📧 Accepted Email Formats
            </p>
            {DEMO_ACCOUNTS.map((a) => (
              <div key={a.role} className="flex items-start gap-2 mb-2 text-sm">
                <span className="text-base leading-5">{a.emoji}</span>
                <div>
                  <span className="font-semibold text-white">{a.role}:</span>{' '}
                  <span className="text-indigo-200">{a.hint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your campus account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Students: any email &nbsp;|&nbsp; Faculty/Admin: institutional email
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-400">Minimum 6 characters</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                Create one
              </Link>
            </div>
          </div>

          {/* ── Demo accounts quick-fill ── */}
          <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              🔐 Demo Accounts — Click to Auto-Fill
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => quickFill(a)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm ${a.color}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{a.emoji} {a.role}</div>
                    <div className="text-xs opacity-75 truncate">
                      {a.email} &nbsp;/&nbsp; {a.password}
                    </div>
                  </div>
                  <span className="text-xs opacity-60 flex-shrink-0">click to fill →</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              📧 Student: any email &nbsp;|&nbsp; Faculty/Admin: institutional email
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
