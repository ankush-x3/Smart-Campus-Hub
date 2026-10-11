import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Lock, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new link.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      setIsLoading(false);
      setResetSuccess(true);
      toast.success(res.data.message || 'Password reset successfully!');
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || 'Invalid or expired password reset link.';
      setErrorMessage(msg);
      toast.error(msg);
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
            Create a New{' '}
            <span className="text-indigo-300">Password.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-md">
            Choose a strong, unique password to protect your account and personal campus data.
          </p>
        </div>

        <div className="relative z-10 space-y-4 text-indigo-100">
          {[
            'Bcrypt-encrypted with salt rounds',
            'Immediate invalidation of single-use reset token',
            'Secure session protection across devices',
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter and confirm your new secure password.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Reset Link Expired or Invalid</h3>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      {errorMessage}
                    </p>
                    <div className="mt-3">
                      <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                      >
                        Request a new reset link &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {resetSuccess ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">Password Reset Complete!</h3>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        Your password has been securely updated. You can now sign in using your new credentials.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Sign In Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Updating password...
                    </>
                  ) : (
                    <>Reset Password <ArrowRight className="w-4 h-4" /></>
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
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
