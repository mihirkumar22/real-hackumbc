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
import Postings from './pages/Postings'
import ViewProfile from './pages/ViewProfile'
import BookmarkedStudents from './pages/BookmarkedStudents'
import Notifications from './pages/Notifications'
import Home from './pages/Home'

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
                   <Route path="/edit-profile" element={<EditProfile />} />
                   <Route path="/postings" element={<Postings />} />
                   <Route path="/your-postings" element={<Postings />} />
                   <Route path="/your-applications" element={<Postings />} />
                   <Route path="/view-profile/:userId" element={<ViewProfile />} />
                   <Route path="/bookmarked-students" element={<BookmarkedStudents />} />
                   <Route path="/notifications" element={<Notifications />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}