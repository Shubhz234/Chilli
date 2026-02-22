import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-dark-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand & Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
                            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-orange-500 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <ChefHat className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                                Chilli
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Your intelligent culinary companion. Discover, save, and learn to cook thousands of recipes with the power of AI.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Explore</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/recipes" className="hover:text-primary-400 transition-colors">All Recipes</Link></li>
                            <li><Link to="/categories" className="hover:text-primary-400 transition-colors">Categories</Link></li>
                            <li><Link to="/search" className="hover:text-primary-400 transition-colors">Smart Search</Link></li>
                            <li><Link to="/favourites" className="hover:text-primary-400 transition-colors">My Favourites</Link></li>
                        </ul>
                    </div>

                    {/* Assistant */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Assistant</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/chilli-ai" className="hover:text-primary-400 transition-colors flex items-center gap-2">Ask Chilli <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs shadow-sm">AI</span></Link></li>
                            <li><Link to="/meal-plan" className="hover:text-primary-400 transition-colors">Meal Planning</Link></li>
                            <li><Link to="/ingredients" className="hover:text-primary-400 transition-colors">Ingredient Scanner</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">Get new recipes and AI tips delivered weekly.</p>
                        <form className="flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-dark-800 border-dark-700 text-sm rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-primary-500 transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-2 rounded-r-lg transition-colors flex items-center"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Chilli AI. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link to="/admin" className="hover:text-gray-300 transition-colors">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
