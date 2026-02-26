import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('chilli_user', JSON.stringify(data));
                window.dispatchEvent(new Event('authStatusChanged'));
                navigate('/');
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden flex-row-reverse">
            {/* Left/Right Side: Professional Splash Image (Reversed for Register) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070"
                    alt="Kitchen Ingredients"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-[10s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-max mb-8 border border-white/20">
                        <ChefHat className="w-12 h-12 text-orange-400" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Join the Network</h1>
                    <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                        Create an account to unlock your personal AI sous-chef, save and share recipes, and build your digital culinary portfolio.
                    </p>
                </div>
            </div>

            {/* Right/Left Side: Dynamic Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-24 bg-gray-50/50 relative">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl -z-10 -translate-y-1/2 -translate-x-1/3"></div>

                <div className="max-w-md w-full mx-auto animate-slide-up">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl shadow-lg shadow-primary-500/30">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight lg:text-left text-center">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 lg:text-left text-center mb-8">
                        Join thousands of creators sharing their favorite recipes.
                    </p>

                    {/* Form Container */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text" required
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Gordon Ramsay"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password" required minLength="6"
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="••••••••"
                                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-primary-600 hover:from-orange-600 hover:to-primary-700 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Registration'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500 font-medium">Already have an account? </span>
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Sign in securely
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
