import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Mail, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverNotice, setServerNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerNotice(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: trimmedEmail });
      setIsLoading(false);
      setSubmitted(true);
      toast.success(res.data.message || 'Reset link sent successfully');
    } catch (err) {
      setIsLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Failed to process request. Please try again later.';

      if (status === 503) {
        // SMTP is not configured on server
        setServerNotice({
          type: 'warning',
          title: 'Email Delivery Not Configured',
          message: message,
        });
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* ── Left side hero ── */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 rounded-full bg-purple-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-10 h-10 text-indigo-300" />
            <span className="text-2xl font-bold tracking-tight">Smart Campus Hub</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Account Access &amp;{' '}
            <span className="text-indigo-300">Security.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-md">
            Reset your password securely to regain access to your campus dashboard, courses, and resources.
          </p>
        </div>

        <div className="relative z-10 space-y-4 text-indigo-100">
          {[
            'Cryptographically secure, single-use reset links',
            'Time-limited 15-minute verification token',
            'Campus administration and Help Desk fallback support',
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your registered email address and we will send you a link to reset your password.
              </p>
            </div>

            {/* Server notice if SMTP is not configured */}
            {serverNotice && (
              <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">{serverNotice.title}</h3>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      {serverNotice.message}
                    </p>
                    <p className="text-xs text-amber-800 mt-2 font-medium">
                      If you need urgent assistance, please contact your Campus Administrator or IT Support Desk.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">Check Your Email</h3>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        If an account exists with <strong className="font-semibold">{email}</strong>, you will receive an email with instructions to reset your password within a few minutes.
                      </p>
                      <p className="text-xs text-emerald-700 mt-2">
                        Please check your spam or junk folder if you do not see it in your inbox.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    Send to a different email
                  </button>

                  <Link
                    to="/login"
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    We will send a secure single-use reset link valid for 15 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending reset link...
                    </>
                  ) : (
                    <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Quick Help box */}
          <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-xs text-slate-500 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p>
              Forgot your registered email? Contact the campus administrator or academic department office for identity verification and account recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
