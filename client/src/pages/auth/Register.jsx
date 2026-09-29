import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Lock, Building, Book,
  ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Per-role configuration ─────────────────────────────────────── */
const ROLE_CONFIG = {
  student: {
    emoji: '🎓',
    label: 'Student',
    emailHint: 'Any personal email — e.g. ankush@gmail.com, abc@yahoo.com',
    emailPlaceholder: 'yourname@gmail.com',
    color: 'indigo',
    badgeBg: 'bg-indigo-100 text-indigo-700',
    borderFocus: 'focus:ring-indigo-500',
  },
  faculty: {
    emoji: '👨‍🏫',
    label: 'Faculty',
    emailHint: 'Institutional email — e.g. prof.sharma@college.edu, faculty@university.ac.in',
    emailPlaceholder: 'yourname@college.edu',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    borderFocus: 'focus:ring-emerald-500',
  },
  admin: {
    emoji: '⚙️',
    label: 'Admin',
    emailHint: 'Admin email — e.g. admin@campus.edu, hod@college.ac.in',
    emailPlaceholder: 'admin@college.edu',
    color: 'rose',
    badgeBg: 'bg-rose-100 text-rose-700',
    borderFocus: 'focus:ring-rose-500',
  },
};

/* ─── Password strength checker ──────────────────────────────────── */
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-rose-500' };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-500' };
  return           { score, label: 'Strong', color: 'bg-emerald-500' };
}

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: '',
    phone: '',
  });
  const [showPassword, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const role   = formData.role;
  const cfg    = ROLE_CONFIG[role];
  const pwdStr = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    const success = await register(formData);
    setIsLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-200 blur-3xl" />
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-purple-200 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the Smart Campus Hub community</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

          {/* Role selector — shown FIRST so hints update */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              I am a… <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLE_CONFIG).map(([key, rc]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: key }))}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    role === key
                      ? `border-${rc.color}-500 ${rc.badgeBg}`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{rc.emoji}</span>
                  <span>{rc.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Ankush Singh"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email — hint changes per role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder={cfg.emailPlaceholder}
                  autoComplete="email"
                />
              </div>
              {/* Dynamic hint per role */}
              <div className={`mt-1.5 flex items-start gap-1.5 px-3 py-1.5 rounded-lg text-xs ${cfg.badgeBg}`}>
                <span className="mt-px">{cfg.emoji}</span>
                <span>{cfg.emailHint}</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Choose a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= pwdStr.score ? pwdStr.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    pwdStr.label === 'Weak'   ? 'text-rose-600' :
                    pwdStr.label === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    Password strength: <strong>{pwdStr.label}</strong>
                  </p>
                </div>
              )}

              <p className="mt-1 text-xs text-slate-400">
                Tip: Use uppercase, numbers & symbols for a stronger password
              </p>
            </div>

            {/* Department + Year (2 cols) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="department"
                    type="text"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              {role === 'student' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Book className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Email format guide card */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email Format Guide
            </p>
          </div>
          <div className="space-y-2">
            {Object.entries(ROLE_CONFIG).map(([key, rc]) => (
              <div key={key} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${rc.badgeBg}`}>
                <span>{rc.emoji}</span>
                <div>
                  <span className="font-semibold">{rc.label}:</span>{' '}
                  <span className="opacity-80">{rc.emailHint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
