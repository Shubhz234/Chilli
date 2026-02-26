import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import ChilliAI from './pages/ChilliAI';
import Favourites from './pages/Favourites';
import Admin from './pages/Admin';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import UploadRecipe from './pages/UploadRecipe';
import CookProfile from './pages/CookProfile';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
        }}
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#ffffff',
            color: '#111827',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            fontWeight: '600',
            border: '1px solid #f3f4f6',
            padding: '16px 24px',
            maxWidth: '100%',
            wordBreak: 'break-word',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Recipes />} />
          <Route path="/chilli-ai" element={<ChilliAI />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/user/:id" element={<CookProfile />} />
          <Route path="/upload" element={<UploadRecipe />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* Additional routes will map here */}
        </Routes>
      </main>
      {isHome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
