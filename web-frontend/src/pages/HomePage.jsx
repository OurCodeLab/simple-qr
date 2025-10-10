import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import QRCodeGenerator from '../components/QRCodeGenerator'
import QRTypeSelector from '../components/QRTypeSelector'
import QRCustomizer from '../components/QRCustomizer'
import MobileModal from '../components/MobileModal'
import { QRTypeSelectionPage, QRCustomizerPage, QRGeneratorPage } from '../components/MobileQRPages'
import { motion as Motion } from 'framer-motion'
import { MdQrCode2 } from 'react-icons/md'

const qrTypes = [
  { id: 'text', name: 'Text', icon: '📝' },
  { id: 'url', name: 'URL/Website', icon: '🔗' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'phone', name: 'Phone Number', icon: '📱' },
  { id: 'sms', name: 'SMS', icon: '💬' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'vcard', name: 'Contact Card', icon: '👤' },
  { id: 'calendar', name: 'Calendar Event', icon: '📅' },
  { id: 'social', name: 'Social Media', icon: '📲' },
  { id: 'file', name: 'File/Image', icon: '📎' },
]

export default function HomePage() {
  const [selectedType, setSelectedType] = useState('text')
  const [qrData, setQrData] = useState('')
  const [formData, setFormData] = useState({})
  const [qrOptions, setQrOptions] = useState({
    size: 300,
    fgColor: '#000000',
    bgColor: '#ffffff',
    errorCorrection: 'M',
    margin: 4,
    logo: null,
    logoSize: 60,
    style: 'square',
  })
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)

  return (
    <MainLayout hideScrollToTop={isMobileModalOpen}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="pt-16 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 text-center">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Simple QR
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Create custom QR codes for free. No limits, no watermarks, no sign-up, no more subscriptions traps - just simple, powerful QR code generation.
              </p>
            </Motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
              {/* Left Side - QR Code Preview */}
              <Motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:sticky lg:top-8"
              >
                <QRCodeGenerator
                  data={qrData}
                  options={qrOptions}
                  type={selectedType}
                  formData={formData}
                />
              </Motion.div>

              {/* Right Side - Configuration */}
              <Motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Type Selector */}
                <QRTypeSelector
                  types={qrTypes}
                  selectedType={selectedType}
                  onTypeSelect={setSelectedType}
                  onDataChange={setQrData}
                  onFormDataChange={setFormData}
                />

                {/* Customization Options */}
                <QRCustomizer
                  options={qrOptions}
                  onOptionsChange={setQrOptions}
                />
              </Motion.div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Mobile QR Preview */}
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="inline-block max-w-xs mx-auto">
                  <QRCodeGenerator
                    data={qrData}
                    options={{
                      ...qrOptions,
                      size: Math.min(qrOptions.size, 280) // Limit size on mobile
                    }}
                    type={selectedType}
                    formData={formData}
                  />
                </div>
              </Motion.div>

              {/* Mobile CTA Button */}
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <button
                  onClick={() => setIsMobileModalOpen(true)}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <MdQrCode2 className="w-6 h-6" />
                  <span>Customize QR Code</span>
                </button>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                  Tap to generate and customize your QR code
                </p>
              </Motion.div>
            </div>
          </div>
        </section>

        {/* Mobile Modal */}
        <MobileModal
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
          title="QR Code Generator"
        >
          {[
            <QRTypeSelectionPage
              key="type-selection"
              type={selectedType}
              onTypeSelect={setSelectedType}
              onDataChange={setQrData}
              onFormDataChange={setFormData}
            />,
            <QRCustomizerPage
              key="customizer"
              options={qrOptions}
              onOptionsChange={setQrOptions}
            />,
            <QRGeneratorPage
              key="generator"
              data={qrData}
              options={qrOptions}
              type={selectedType}
              formData={formData}
            />
          ]}
        </MobileModal>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to create professional QR codes for any purpose
              </p>
            </Motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🎨',
                  title: 'Full Customization',
                  description: 'Customize colors, size, error correction, and add your logo'
                },
                {
                  icon: '📱',
                  title: 'Mobile Responsive',
                  description: 'Works perfectly on all devices and screen sizes'
                },
                {
                  icon: '💾',
                  title: 'Multiple Formats',
                  description: 'Download as PNG, SVG, or PDF with high resolution'
                },
                {
                  icon: '🔒',
                  title: 'Privacy First',
                  description: 'All processing happens in your browser. No data sent to servers'
                },
                {
                  icon: '⚡',
                  title: 'Real-time Preview',
                  description: 'See your QR code update instantly as you make changes'
                },
                {
                  icon: '📊',
                  title: 'Multiple Types',
                  description: 'Support for URLs, text, contacts, WiFi, and much more'
                },
                {
                  icon: '🤝',
                  title: 'Support Our Service',
                  description: 'Optional redirect feature to support our free QR generator'
                },
                {
                  icon: '🚀',
                  title: 'Always Free',
                  description: 'No registration, no limits, no hidden costs - forever free'
                }
              ].map((feature, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 flex flex-row items-start">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Simple QR?
                </h2>
                <div className="text-6xl mb-6">🤯</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-8"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    The Problem
                  </h3>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      I needed to create a simple QR code for a project. Sounds easy, right? Wrong!
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Every single website I found online had the same frustrating pattern:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="text-red-500 mr-3 text-lg">❌</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          Paid subscription services for something that should be free
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-500 mr-3 text-lg">❌</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          "Free" trials that require credit card details
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-500 mr-3 text-lg">❌</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          Mandatory sign-ups to download a simple QR code
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-500 mr-3 text-lg">❌</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          Watermarks and limitations on "free" plans
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-500 mr-3 text-lg">❌</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          Ads everywhere and data collection
                        </span>
                      </li>
                    </ul>
                  </div>
                </Motion.div>

                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-8"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    The Solution
                  </h3>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      That's ridiculous! QR code generation is a simple algorithm that should be accessible to everyone. So I built this tool with a simple philosophy:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Always free</strong> - No hidden costs, ever
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">No registration</strong> - Just use it immediately
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Privacy first</strong> - All processing happens in your browser
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">No ads</strong> - Clean, focused interface
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Open source</strong> - Transparent and community-driven
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Full features</strong> - Professional-grade customization
                        </span>
                      </li>
                    </ul>
                  </div>
                </Motion.div>
              </div>

              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <div className="backdrop-blur-md bg-blue-50/70 dark:bg-blue-900/30 border border-blue-200/30 dark:border-blue-700/50 rounded-xl p-8 shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Built with ❤️ for the Community
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    This tool is completely free because I believe basic utilities like QR code generation should be accessible to everyone.
                  </p>
                </div>
              </Motion.div>
            </Motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}