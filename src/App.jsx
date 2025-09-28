import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import NotLoggedIn from './pages/NotLoggedIn'
import Unauthorized from './pages/Unauthorized'
import ProtectedLayout from './components/ProtectedLayout'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Lesson from './pages/Lesson'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home /> } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/not-logged-in" element={<NotLoggedIn />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route element={<ProtectedLayout />}>
                   <Route path="/dashboard" element={<Dashboard />} />
                   <Route path="/learn" element={<Learn />}/>
                   <Route path="/lesson" element = {<Lesson />} />
                   <Route path="/edit-profile" element={<EditProfile />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}