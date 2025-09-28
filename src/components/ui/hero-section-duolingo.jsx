import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { ArrowRight, Mail, Menu, Send, X, Play, Trophy, Users, BookOpen, Camera, Target, Star, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import BeanstalkImage from '../landing/durr.webp'
import { EvervaultCard, Icon } from './evervault-card'
import { GlowCard } from './spotlight-card'
import { AnimatedTabs } from './animated-tabs'
import Footer4Col from './footer-column'

const menuItems = [
    { name: 'Learn', href: '#learn' },
    { name: 'Practice', href: '#practice' },
    { name: 'Progress', href: '#progress' },
    { name: 'About', href: '#about' },
]

export function HeroSection() {
    const [menuState, setMenuState] = useState(false)
    
    return (
        <>
            <header>
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    data-state={menuState && 'active'}
                    className="group fixed z-20 w-full border-b border-green-200 bg-white/95 backdrop-blur md:relative lg:bg-transparent">
                    <div className="m-auto max-w-6xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    to="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <div className="text-2xl">🌱</div>
                                    <span className="text-xl font-bold text-green-600">Beanstalk</span>
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-green-600" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-green-600" />
                                </button>
                            </div>

                            <div className="bg-white group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-green-200 p-6 shadow-lg md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={item.href}
                                                    className="text-green-600 hover:text-green-700 block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l border-green-200 lg:pl-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-300 text-green-600 hover:bg-green-50">
                                        <Link to="/login">Login</Link>
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white">
                                        <Link to="/register">Get Started</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.nav>
            </header>

            <main className="min-h-screen bg-white">
                <section className="overflow-hidden">
                    <div className="relative mx-auto max-w-6xl px-6 py-28 lg:py-20">
                        <div className="lg:flex lg:items-center lg:gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative z-10 mx-auto max-w-2xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <div
                                    className="rounded-lg mx-auto flex w-fit items-center gap-2 border border-green-200 p-1 pr-3 lg:ml-0 bg-green-50">
                                    <span className="bg-green-500 rounded px-2 py-1 text-xs text-white">New</span>
                                    <span className="text-sm text-green-700">Learn ASL with Beanstalk</span>
                                    <ArrowRight className="size-4 text-green-600" />
                                </div>

                                <h1 className="mt-10 text-balance text-4xl font-bold text-gray-800 md:text-5xl xl:text-6xl">
                                    The Fun Way to Learn American Sign Language
                                </h1>
                                <p className="mt-8 text-lg text-gray-600">
                                    Master ASL with interactive lessons, real-time AI feedback from your camera, and a learning path that grows with you.
                                </p>

                                <div>
                                    <form
                                        action=""
                                        className="mx-auto my-10 max-w-md lg:my-12 lg:ml-0 lg:mr-auto">
                                        <div className="bg-white has-[input:focus]:ring-green-500/50 relative grid grid-cols-[1fr_auto] items-center rounded-[1rem] border border-green-200 pr-1 shadow-lg has-[input:focus]:ring-2">
                                            <Mail className="text-gray-400 pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                                            <input
                                                placeholder="Enter your email"
                                                className="h-14 w-full bg-transparent pl-12 text-gray-800 placeholder-gray-400 focus:outline-none"
                                                type="email"
                                            />

                                            <div className="md:pr-1.5 lg:pr-0">
                                                <Button
                                                    aria-label="submit"
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                    <span className="hidden md:block">Get Started</span>
                                                    <Send
                                                        className="relative mx-auto size-5 md:hidden"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Duolingo-style features */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Play className="size-4 text-green-500" />
                                            <span className="text-sm">Interactive Lessons</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Trophy className="size-4 text-green-500" />
                                            <span className="text-sm">Daily Streaks</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="size-4 text-green-500" />
                                            <span className="text-sm">AI Feedback</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Beanstalk Hero Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative lg:w-1/2 mt-12 lg:mt-0">
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        <img 
                                            src={BeanstalkImage} 
                                            alt="Beanstalk ASL Learning" 
                                            className="w-full max-w-md h-auto object-contain drop-shadow-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Master ASL in three progressive stages, from basic alphabet to complex conversations
                            </p>
                        </motion.div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Stage 1: Alphabet */}
                            <GlowCard glowColor="green" size="lg" className="bg-white">
                                <div className="text-center p-6">
                                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <BookOpen className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Stage 1: Alphabet</h3>
                                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                                        Start with the ASL alphabet through 7 interactive circles. Learn 8-9 letters per circle with visual guides and camera practice.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Visual letter recognition
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Camera-based practice
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Mastery tracking
                                        </li>
                                    </ul>
                                </div>
                            </GlowCard>

                            {/* Stage 2: Common Terms */}
                            <GlowCard glowColor="green" size="lg" className="bg-white">
                                <div className="text-center p-6">
                                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Target className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Stage 2: Common Terms</h3>
                                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                                        Build vocabulary with essential categories: colors, family, and feelings. Perfect your signing with AI feedback.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Colors & Family
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Emotions & Feelings
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Real-time feedback
                                        </li>
                                    </ul>
                                </div>
                            </GlowCard>

                            {/* Stage 3: Conversations */}
                            <GlowCard glowColor="green" size="lg" className="bg-white">
                                <div className="text-center p-6">
                                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Stage 3: Conversations</h3>
                                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                                        Master practical conversations with questions and responses. Learn essential ASL phrases for daily communication.
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-3 text-left">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Questions & Responses
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Daily conversations
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Practical phrases
                                        </li>
                                    </ul>
                                </div>
                            </GlowCard>
                        </div>
                    </div>
                </section>

                {/* Features Section with Animated Tabs */}
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Features</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Experience the most advanced ASL learning platform with cutting-edge technology
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex justify-center">
                            <AnimatedTabs 
                                tabs={[
                                    {
                                        id: "lessons",
                                        label: "Interactive Lessons",
                                        content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800">Interactive Lessons</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Learn ASL through engaging, bite-sized lessons with visual aids and step-by-step guidance designed for all skill levels.
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Visual learning aids</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Step-by-step guidance</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Adaptive difficulty</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        id: "ai",
                                        label: "AI Feedback",
                                        content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center">
                                                        <Camera className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800">AI-Powered Feedback</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Get instant feedback on your signing accuracy using advanced computer vision technology and machine learning.
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Real-time analysis</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Accuracy scoring</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Improvement tips</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        id: "progress",
                                        label: "Progress Tracking",
                                        content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center">
                                                        <Trophy className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800">Progress Tracking</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        Track your learning journey with detailed analytics, streaks, and personalized recommendations to keep you motivated.
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Learning streaks</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Detailed analytics</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Personalized goals</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </motion.div>
                    </div>
                </section>


                {/* Final CTA Section */}
                <section className="py-20 bg-green-500">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Signing Journey?</h2>
                        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of learners mastering ASL with Beanstalk. Start free today and unlock the world of sign language.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-green-500 hover:bg-gray-100 text-lg px-8 py-4 rounded-full"
                        >
                            Start Learning Free
                        </Button>
                        <p className="text-green-100 text-sm mt-4">
                            No credit card required • Free forever plan available
                        </p>
                    </motion.div>
                </section>

                {/* Footer */}
                <Footer4Col />
            </main>
        </>
    )
}
