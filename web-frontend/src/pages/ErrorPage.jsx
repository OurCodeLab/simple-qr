import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { motion } from 'framer-motion'
import { MdHome, MdQrCode2, MdError } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-hd-dark-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <MdError className="h-16 w-16 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <MdQrCode2 className="h-5 w-5" />
              Go to QR Generator
            </Link>
            
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <MdHome className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help? Our QR code generator is free to use and doesn't require any registration.
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}