import React from 'react'
import MainNavbar from '../components/MainNavbar'
import MainFooter from '../components/MainFooter'
import { ThemeProvider } from '../context/ThemeContext'
import { motion as Motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MdArrowUpward } from 'react-icons/md'

export default function MainLayout({ children, hideScrollToTop = false }) {
    const [showTop, setShowTop] = useState(false)

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-hd-white dark:bg-hd-dark-bg text-hd-black dark:text-hd-dark-text transition-colors duration-300">
                <MainNavbar />

                <main className="flex-1">
                    <Motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.45 }}
                    >
                        {children}
                    </Motion.div>
                </main>

                <MainFooter />

                {showTop && !hideScrollToTop && (
                    <button
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        className="fixed right-6 bottom-6 size-12 z-50 bg-hd-brown dark:bg-hd-dark-brown text-white rounded-full shadow-lg hover:scale-105 transform-gpu transition flex items-center justify-center"
                    >
                        <MdArrowUpward size={24} />
                    </button>
                )}
            </div>
        </ThemeProvider>
    )
}
