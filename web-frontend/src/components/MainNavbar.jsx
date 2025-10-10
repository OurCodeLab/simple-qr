import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { MdMenu, MdSunny, MdNightlight, MdQrCode2 } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function MainNavbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  const navLinks = [
    { name: 'Generator', action: () => window.scrollTo(0, 0), },
    { name: 'Features', href: '#features', action: () => scrollToSection('features') },
    { name: 'About', href: '#about', action: () => scrollToSection('about') },
  ]

  return (
    <header className="sticky top-0 z-[100] backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-white/20 dark:border-gray-700/50 shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-blue-500 rounded-lg">
              <MdQrCode2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-left font-light text-xl text-hd-black dark:text-hd-dark-text tracking-wide uppercase">
                Simple QR
              </div>
              <div className="text-left text-xs text-hd-brown dark:text-hd-dark-brown -mt-1 tracking-widest uppercase">
                Get your QR Code in Seconds
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hd-brown dark:bg-hd-dark-brown transition-all duration-200 group-hover:w-full"></span>
                </a>
              ) : link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hd-brown dark:bg-hd-dark-brown transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hd-brown dark:bg-hd-dark-brown transition-all duration-200 group-hover:w-full"></span>
                </button>
              )
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-3 bg-hd-gray-100 dark:bg-hd-dark-surface hover:bg-hd-gray-200 dark:hover:bg-hd-dark-bg transition-all duration-200 rounded-full"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <MdSunny className="h-4 w-4 text-hd-brown dark:text-hd-dark-brown" />
              ) : (
                <MdNightlight className="h-4 w-4 text-hd-brown dark:text-hd-dark-brown" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setOpen(!open)} 
              className="md:hidden p-3 bg-transparent hover:bg-hd-gray-100 dark:hover:bg-hd-dark-surface transition-colors duration-200" 
              aria-expanded={open} 
              aria-label="Toggle menu"
            >
              <MdMenu className="h-4 w-4 text-hd-black dark:text-hd-dark-text" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
            <Motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden border-t border-hd-gray-200 dark:border-hd-dark-border overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-left text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 py-2"
                    >
                      {link.name}
                    </a>
                  ) : link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="text-left text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 py-2"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      key={link.name}
                      onClick={link.action}
                      className="text-left text-hd-black dark:text-hd-dark-text hover:text-hd-brown dark:hover:text-hd-dark-brown font-medium transition-colors duration-200 py-2"
                    >
                      {link.name}
                    </button>
                  )
                ))}
                <div className="pt-4 border-t border-hd-gray-200 dark:border-hd-dark-border">
                  <p className="text-sm text-hd-gray-600 dark:text-hd-dark-text-muted mb-2">QR Code Generator</p>
                  <p className="text-xs text-hd-gray-500 dark:text-hd-dark-text-muted">Create custom QR codes for any purpose</p>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
