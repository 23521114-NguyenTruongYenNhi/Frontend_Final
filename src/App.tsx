import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddRecipePage } from './pages/AddRecipePage';
import { AdminPage } from './pages/AdminPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/add-recipe" element={<AddRecipePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
