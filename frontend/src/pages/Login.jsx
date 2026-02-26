import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, ArrowRight, User, KeyRound, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [otpStep, setOtpStep] = useState('request'); // 'request' or 'verify'

    const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showNewUserPopup, setShowNewUserPopup] = useState(false);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('chilli_user', JSON.stringify(data));
                window.dispatchEvent(new Event('authStatusChanged'));
                navigate('/');
            } else {
                const errorData = await res.json();
                if (res.status === 404 && errorData.code === 'USER_NOT_FOUND') {
                    setShowNewUserPopup(true);
                } else {
                    toast.error(errorData.message || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/users/login/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setOtpStep('verify');
            } else {
                if (res.status === 404 && data.code === 'USER_NOT_FOUND') {
                    setShowNewUserPopup(true);
                } else {
                    toast.error(data.message || 'Failed to send OTP');
                }
            }
        } catch (error) {
            toast.error('An error occurred sending the OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/users/login/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('chilli_user', JSON.stringify(data));
                window.dispatchEvent(new Event('authStatusChanged'));
                navigate('/');
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'OTP Verification failed');
            }
        } catch (error) {
            toast.error('An error occurred during verification');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden">
            {/* Left Side: Professional Splash Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070"
                    alt="Kitchen Setup"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-[10s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-max mb-8 border border-white/20">
                        <ChefHat className="w-12 h-12 text-primary-400" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Master Your Kitchen</h1>
                    <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                        Join the Chilli culinary network. Discover personalized AI recipes, connect with pro chefs, and elevate your cooking.
                    </p>
                </div>
            </div>

            {/* Right Side: Dynamic Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-24 bg-gray-50/50 relative">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3"></div>

                <div className="max-w-md w-full mx-auto animate-slide-up">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl shadow-lg shadow-primary-500/30">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight lg:text-left text-center">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 lg:text-left text-center mb-8">
                        Sign in to access your saved recipes and AI Sous-Chef.
                    </p>

                    {/* Method Toggles */}
                    <div className="flex p-1 bg-gray-200/60 rounded-xl mb-8">
                        <button
                            type="button"
                            onClick={() => { setLoginMethod('password'); setOtpStep('request'); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === 'password' ? 'bg-white text-gray-900 shadow-sm shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Standard Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('otp')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${loginMethod === 'otp' ? 'bg-white text-gray-900 shadow-sm shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ShieldCheck className="w-4 h-4" /> OTP Login
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

                        {/* PASSWORD LOGIN FLOW */}
                        {loginMethod === 'password' && (
                            <form className="space-y-5" onSubmit={handlePasswordLogin}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email" required
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                            placeholder="chef@example.com"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-bold text-gray-700">Password</label>
                                        <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-500">Forgot?</a>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password" required
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                            placeholder="••••••••"
                                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className="w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Log In Securely'}
                                </button>
                            </form>
                        )}

                        {/* OTP LOGIN FLOW */}
                        {loginMethod === 'otp' && (
                            <form className="space-y-5" onSubmit={otpStep === 'request' ? handleSendOTP : handleVerifyOTP}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Registered Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email" required disabled={otpStep === 'verify'}
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm disabled:opacity-50"
                                            placeholder="chef@example.com"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {otpStep === 'verify' && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">6-Digit OTP Code</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text" required maxLength="6"
                                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-center tracking-widest font-mono text-lg font-bold"
                                                placeholder="000000"
                                                value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 text-center">We've sent a secure code to your email.</p>
                                    </div>
                                )}

                                <button
                                    type="submit" disabled={isLoading}
                                    className="w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-gray-900/20 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        otpStep === 'request' ? 'Send OTP Protocol' : 'Verify & Log In'
                                    )}
                                </button>

                                {otpStep === 'verify' && (
                                    <button type="button" onClick={() => setOtpStep('request')} className="w-full text-xs font-semibold text-gray-500 hover:text-gray-700 mt-2">
                                        Use a different email address?
                                    </button>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500 font-medium">New to Chilli? </span>
                        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Create your account
                        </Link>
                    </div>
                </div>
            </div>

            {/* New User Not Found Popup */}
            {showNewUserPopup && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in px-4">
                    <div className="bg-white p-8 max-w-sm w-full rounded-3xl shadow-2xl scale-100 transform transition-transform">
                        <div className="mb-6 text-center">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                <User className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">User Not Found</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We couldn't find an account matching that email address. Would you like to set one up?
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full py-3 text-white bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20"
                            >
                                Register New Account
                            </button>
                            <button
                                onClick={() => setShowNewUserPopup(false)}
                                className="w-full py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
