import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { authApi } from '../../api/authApi';

const CreateAccount = () => {
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();

    // email can arrive via navigation state or querystring
    const searchParams = new URLSearchParams(location.search);
    const emailFromQuery = searchParams.get('email');
    const emailFromState = location.state && location.state.email ? location.state.email : null;
    const debugFromState = location.state && location.state.debug ? location.state.debug : null;
    const [email, setEmail] = useState(emailFromState || emailFromQuery || '');

    const [code, setCode] = useState('');
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [debug, setDebug] = useState(null);

    // Hydrate from session storage on first load if user refreshed the page
    useEffect(() => {
        try {
            if (!email) {
                const storedEmail = sessionStorage.getItem('aa_email_pending');
                if (storedEmail) setEmail(storedEmail);
            }
            // No debug hydration; real SMTP flow does not expose codes
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist email/debug so they survive refreshes
    useEffect(() => {
        if (email) sessionStorage.setItem('aa_email_pending', email);
    }, [email]);
    // Remove any stale debug data from previous dev sessions
    useEffect(() => {
        try { sessionStorage.removeItem('aa_debug_verification'); } catch {}
    }, []);

    useEffect(() => {
        let timerId;
        if (cooldown > 0) {
            timerId = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
        }
        return () => { if (timerId) clearInterval(timerId); };
    }, [cooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email || !code) {
            setStatus({ type: 'error', message: 'Please enter your email and the 6-digit code.' });
            return;
        }
        setIsSubmitting(true);
        setStatus({ type: 'loading', message: 'Verifying…' });
        try {
            const resp = await authApi.verifyEmail({ email, code });
            if (resp.success) {
                setStatus({ type: 'success', message: 'Email verified! Redirecting…' });
                // Clear persisted state after success
                sessionStorage.removeItem('aa_email_pending');
                try { sessionStorage.removeItem('aa_debug_verification'); } catch {}
                setTimeout(() => navigate('/signin'), 1000);
            } else {
                setStatus({ type: 'error', message: resp.message || 'Verification failed' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Network error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setStatus({ type: 'error', message: 'Please provide your email to resend the code.' });
            return;
        }
        setStatus({ type: 'loading', message: 'Sending a new code…' });
        try {
            const resp = await authApi.resendVerification({ email });
            if (resp.success) {
                setStatus({ type: 'success', message: 'A new code has been sent to your email.' });
                setCooldown(30);
                // No debug handling in production email flow
            } else {
                setStatus({ type: 'error', message: resp.message || 'Failed to resend code' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Network error' });
        }
    };

    const statusColor = status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-500' : isDarkMode ? 'text-gray-300' : 'text-gray-700';

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <header className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-orange-500">ArtisanAura</Link>
                        <Link to="/signin" className={`px-4 py-2 rounded-full border transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Sign In</Link>
                    </div>
                </div>
            </header>

            <main className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Verify your email</h2>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 text-sm`}>
                            We sent a 6-digit code to your email. Enter it below to activate your account.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Verification code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="^[0-9]{6}$"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                                onInvalid={(e) => e.target.setCustomValidity('Enter the 6-digit code from your email')}
                                onInput={(e) => e.currentTarget.setCustomValidity('')}
                                className={`w-full tracking-widest text-center text-lg px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                placeholder="123456"
                                required
                                autoComplete="one-time-code"
                            />
                        </div>

                        {status.message ? (
                            <p className={`text-sm ${statusColor}`}>{status.message}</p>
                        ) : null}

                        {/* No debug UI in production */}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''} bg-gray-900 text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors`}
                        >
                            {isSubmitting ? 'Verifying…' : 'Verify email'}
                        </button>
                    </form>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={cooldown > 0}
                            className={`text-sm ${cooldown > 0 ? 'opacity-60 cursor-not-allowed' : 'text-orange-500 hover:text-orange-600'}`}
                        >
                            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                        </button>
                        <Link to="/register" className="text-sm text-gray-500 hover:text-gray-600">Change email</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateAccount;


