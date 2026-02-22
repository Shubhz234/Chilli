import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const checkUser = () => {
            const stored = localStorage.getItem('chilli_user');
            if (stored) setUser(JSON.parse(stored));
            else setUser(null);
        };
        checkUser();
        window.addEventListener('authStatusChanged', checkUser);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('authStatusChanged', checkUser);
        };
    }, []);

    const baseNavLinks = [
        { name: 'Home', path: '/' },
        { name: 'Recipes', path: '/recipes' },
        { name: 'Categories', path: '/categories' },
        { name: 'Favourites', path: '/favourites' },
    ];

    const navLinks = user?.isAdmin
        ? [...baseNavLinks, { name: 'Admin Panel', path: '/admin' }]
        : baseNavLinks;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'glass-panel py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                            <ChefHat className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                            Chilli
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6 relative">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors hover:text-primary-500 ${location.pathname === link.path
                                        ? 'text-primary-500'
                                        : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {isSearchOpen ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (searchTerm.trim()) {
                                            navigate('/recipes', { state: { searchTerm: searchTerm.trim() } });
                                        } else {
                                            navigate('/recipes');
                                        }
                                        setIsSearchOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 animate-fade-in"
                                >
                                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search recipes..."
                                        className="bg-transparent border-none focus:outline-none text-sm w-32 md:w-48 text-gray-700"
                                        autoFocus
                                        onBlur={() => {
                                            if (!searchTerm) setIsSearchOpen(false);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 ml-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-full transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                            {user ? (
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-primary-500 bg-primary-50 text-primary-600 transition-all text-sm font-bold shadow-sm"
                                >
                                    <User className="w-4 h-4" />
                                    {user.name.split(' ')[0]}
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-primary-500 hover:text-primary-500 transition-all text-sm font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            <div
                className={`md:hidden absolute top-full left-0 w-full glass-panel border-t border-gray-100 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-500 hover:bg-primary-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                        {user ? (
                            <Link
                                to="/profile"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                View Profile
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
