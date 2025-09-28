import React, { useState, useEffect } from 'react'
import { Button, Input, Card, Spacer, Grid, Text, Link as GeistLink } from '@geist-ui/core'
import { Mail, Send, Menu, X } from '@geist-ui/icons'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                            >
                                <motion.div variants={transitionVariants.item}>
                                    <Text h1 className="text-4xl font-medium sm:text-5xl md:text-6xl font-geist">
                                        Healthier daily routine
                                    </Text>
                                </motion.div>

                                <Spacer h={1} />

                                <motion.div variants={transitionVariants.item}>
                                    <Text p className="mx-auto max-w-2xl text-lg text-gray-600">
                                        Geist UI highly customizable components for building modern websites and applications that look and feel the way you mean it.
                                    </Text>
                                </motion.div>

                                <Spacer h={2} />

                                <motion.div variants={transitionVariants.item}>
                                    <Card className="mx-auto max-w-sm p-4">
                                        <Grid.Container gap={1} alignItems="center">
                                            <Grid xs={20}>
                                                <Input
                                                    icon={<Mail />}
                                                    placeholder="Your mail address"
                                                    type="email"
                                                    width="100%"
                                                />
                                            </Grid>
                                            <Grid xs={4}>
                                                <Button 
                                                    type="secondary" 
                                                    icon={<Send />}
                                                    auto
                                                >
                                                    Get Started
                                                </Button>
                                            </Grid>
                                        </Grid.Container>
                                    </Card>
                                </motion.div>

                                <Spacer h={3} />

                                <motion.div variants={transitionVariants.item}>
                                    <div className="relative mx-auto mt-32 max-w-2xl">
                                        <Card className="p-6">
                                            <AppComponent />
                                        </Card>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const AppComponent = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-500">
                <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                <Text span className="text-sm font-medium">Steps</Text>
            </div>
            <div className="space-y-4">
                <Text p className="text-sm font-medium border-b border-gray-200 pb-3">
                    This year, you're walking more on average than you did in 2023.
                </Text>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <Text span className="text-xl font-medium">8,081</Text>
                            <Text span className="text-xs text-gray-500">Steps/day</Text>
                        </div>
                        <div className="h-5 bg-gradient-to-r from-emerald-400 to-indigo-600 rounded px-2 flex items-center">
                            <Text span className="text-xs text-white">2024</Text>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <Text span className="text-xl font-medium">5,412</Text>
                            <Text span className="text-xs text-gray-500">Steps/day</Text>
                        </div>
                        <div className="h-5 bg-gray-200 w-2/3 rounded px-2 flex items-center">
                            <Text span className="text-xs">2023</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav className={`fixed z-20 w-full px-2 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg' : ''}`}>
                <div className={`mx-auto max-w-6xl px-6 py-4 ${isScrolled ? 'rounded-2xl border' : ''}`}>
                    <Grid.Container gap={2} alignItems="center" justify="space-between">
                        <Grid>
                            <Link to="/" className="flex items-center space-x-2">
                                <Logo />
                            </Link>
                        </Grid>

                        <Grid className="hidden lg:block">
                            <Grid.Container gap={3}>
                                {menuItems.map((item, index) => (
                                    <Grid key={index}>
                                        <GeistLink href={item.href} className="text-gray-600 hover:text-gray-900">
                                            {item.name}
                                        </GeistLink>
                                    </Grid>
                                ))}
                            </Grid.Container>
                        </Grid>

                        <Grid>
                            <Grid.Container gap={1}>
                                <Grid>
                                    <Button as={Link} to="/login" type="secondary" size="small">
                                        Login
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button as={Link} to="/register" type="primary" size="small">
                                        Sign Up
                                    </Button>
                                </Grid>
                            </Grid.Container>
                        </Grid>

                        <Grid className="lg:hidden">
                            <Button 
                                icon={menuState ? <X /> : <Menu />}
                                auto
                                onClick={() => setMenuState(!menuState)}
                            />
                        </Grid>
                    </Grid.Container>

                    {menuState && (
                        <Card className="mt-4 lg:hidden">
                            <div className="space-y-4">
                                {menuItems.map((item, index) => (
                                    <GeistLink key={index} href={item.href} block>
                                        {item.name}
                                    </GeistLink>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </nav>
        </header>
    )
}

const LogoCloud = () => {
    return (
        <section className="py-16 md:py-32 bg-gray-50">
            <div className="mx-auto max-w-6xl px-6">
                <Grid.Container gap={2} alignItems="center">
                    <Grid xs={24} md={6}>
                        <Text p className="text-sm text-gray-600">Powering the best teams</Text>
                    </Grid>
                    <Grid xs={24} md={18}>
                        <div className="flex items-center gap-8 overflow-hidden">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="flex-shrink-0">
                                    <img
                                        className="h-6 w-auto opacity-60"
                                        src={`https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=24&fit=crop&crop=center&${i}`}
                                        alt={`Logo ${i}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid.Container>
            </div>
        </section>
    )
}

const Logo = ({ className }) => {
    return (
        <div className={`flex items-center space-x-2 ${className || ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Text span className="text-white font-bold text-sm">G</Text>
            </div>
            <Text span className="font-bold text-lg">Geist</Text>
        </div>
    )
}
