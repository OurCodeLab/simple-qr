import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import QRCodeGenerator from '../components/QRCodeGenerator'
import QRTypeSelector from '../components/QRTypeSelector'
import QRCustomizer from '../components/QRCustomizer'
import MobileModal from '../components/MobileModal'
import { QRTypeSelectionPage, QRCustomizerPage, QRGeneratorPage } from '../components/MobileQRPages'
import { motion as Motion } from 'framer-motion'
import {
  MdQrCode2,
  MdAutoAwesome,
  MdPalette,
  MdSmartphone,
  MdDownload,
  MdSecurity,
  MdFlashOn,
  MdQrCodeScanner,
  MdVolunteerActivism,
  MdRocketLaunch,
  MdLightbulb,
  MdCheckCircle,
  MdClose,
  MdFavorite,
  MdArticle,
  MdLink,
  MdEmail,
  MdPhone,
  MdSms,
  MdWifi,
  MdPerson,
  MdEvent,
  MdShare,
  MdAttachMoney,
  MdAttachFile
} from 'react-icons/md'

const qrTypes = [
  { id: 'text', name: 'Text', icon: <MdArticle className="w-5 h-5 text-blue-500" /> },
  { id: 'url', name: 'URL/Website', icon: <MdLink className="w-5 h-5 text-indigo-500" /> },
  { id: 'email', name: 'Email', icon: <MdEmail className="w-5 h-5 text-red-500" /> },
  { id: 'phone', name: 'Phone Number', icon: <MdPhone className="w-5 h-5 text-green-500" /> },
  { id: 'sms', name: 'SMS', icon: <MdSms className="w-5 h-5 text-purple-500" /> },
  { id: 'wifi', name: 'WiFi', icon: <MdWifi className="w-5 h-5 text-orange-500" /> },
  { id: 'vcard', name: 'Contact Card', icon: <MdPerson className="w-5 h-5 text-teal-500" /> },
  { id: 'calendar', name: 'Calendar Event', icon: <MdEvent className="w-5 h-5 text-pink-500" /> },
  { id: 'social', name: 'Social Media', icon: <MdShare className="w-5 h-5 text-cyan-500" /> },
  { id: 'paynow', name: 'PayNow (SG)', icon: <MdAttachMoney className="w-5 h-5 text-emerald-500" /> },
  { id: 'file', name: 'File/Image', icon: <MdAttachFile className="w-5 h-5 text-amber-500" /> },
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
                <MdAutoAwesome className="w-4 h-4 text-amber-500" />
                <span>100% Free Custom QR Code Generator</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                Create Free Custom QR Codes <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Without Ads or Subscriptions
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Tired of QR code sites demanding credit cards, subscriptions, or imposing scan limits? Simple QR lets you create, customize with your logo, and export high-resolution QR codes instantly for free — with 100% client-side privacy.
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

        {/* Comparison Matrix Section */}
        <section id="comparison" className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-5xl">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple QR vs. Paid QR Generators
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See why thousands of users switch to Simple QR over expensive subscription services.
              </p>
            </Motion.div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="p-4 text-lg font-semibold">Feature</th>
                    <th className="p-4 text-lg font-semibold bg-blue-700/50">Simple QR</th>
                    <th className="p-4 text-lg font-semibold opacity-90">Other QR Code Sites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                  <tr>
                    <td className="p-4 font-medium">Pricing & Subscriptions</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">100% Free Forever ($0)</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">$9 - $49 / month subscription</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Account & Credit Card</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">No Sign-up Needed</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">Mandatory Registration & Credit Card</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Data Privacy & Security</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">100% In-Browser (Local)</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">Server tracking & analytics logging</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Custom Logo Overlay</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">Included Free</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">Locked behind Pro tier</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">High-Res Export (SVG / PNG / PDF)</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">Unlimited Vector Downloads</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">Watermarked or low resolution</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Scan Limits & Expiration</td>
                    <td className="p-4 font-bold text-green-700 dark:text-green-400">Unlimited Scans, Never Expires</td>
                    <td className="p-4 font-medium text-red-700 dark:text-red-400">Capped scan limits, codes expire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

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
                Everything You Need in a Free QR Generator
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Designed for speed, privacy, and full visual customization
              </p>
            </Motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MdPalette className="text-4xl text-purple-500 mb-4" />,
                  title: 'Full Customization',
                  description: 'Customize foreground and background colors, dot styles, error correction levels, and central logo'
                },
                {
                  icon: <MdSmartphone className="text-4xl text-blue-500 mb-4" />,
                  title: 'Mobile Responsive',
                  description: 'Smooth, beautiful interface optimized for smartphone, tablet, and desktop screens'
                },
                {
                  icon: <MdDownload className="text-4xl text-emerald-500 mb-4" />,
                  title: 'Vector & Print Exports',
                  description: 'Export high-definition PNGs, scalable vector SVGs, and print-ready PDFs'
                },
                {
                  icon: <MdSecurity className="text-4xl text-indigo-500 mb-4" />,
                  title: '100% Client-Side Privacy',
                  description: 'All QR codes generate locally in your browser — zero data is sent to external servers'
                },
                {
                  icon: <MdFlashOn className="text-4xl text-amber-500 mb-4" />,
                  title: 'Real-time Live Preview',
                  description: 'Watch your customized QR code update instantly with every color or text tweak'
                },
                {
                  icon: <MdQrCodeScanner className="text-4xl text-teal-500 mb-4" />,
                  title: '10+ QR Data Types',
                  description: 'Support for URLs, WiFi networks, vCard contacts, PayNow (Singapore), SMS, and Email'
                },
                {
                  icon: <MdVolunteerActivism className="text-4xl text-pink-500 mb-4" />,
                  title: 'Transparent Redirect Option',
                  description: 'Optional redirect support to help maintain free services without tracking user data'
                },
                {
                  icon: <MdRocketLaunch className="text-4xl text-rose-500 mb-4" />,
                  title: 'Truly Free Forever',
                  description: 'No trial periods, no hidden fees, no credit cards required, and zero advertisements'
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
                  {feature.icon}
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

        {/* FAQ Section for SEO */}
        <section id="faq" className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-4xl">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to know about creating free QR codes with Simple QR
              </p>
            </Motion.div>

            <div className="space-y-6">
              {[
                {
                  q: "Is Simple QR really 100% free with no hidden charges?",
                  a: "Yes, 100%! Simple QR is completely free to use. There are no subscription fees, no credit card requirements, no trial timers, no watermarks, and no limits on how many QR codes you can create or scan."
                },
                {
                  q: "Do QR codes generated here ever expire?",
                  a: "No. Static QR codes encode your data (URLs, WiFi passwords, contact details) directly into the QR pattern itself. Because they don't rely on an external server to resolve, they remain valid indefinitely."
                },
                {
                  q: "Is my personal data safe when using Simple QR?",
                  a: "Yes! Simple QR executes entirely within your web browser (client-side rendering). Your inputs, custom logos, WiFi credentials, and contact cards never leave your device and are never sent to external servers."
                },
                {
                  q: "Can I add custom logos or brand icons to my QR code?",
                  a: "Yes! You can upload any image or logo to embed in the center of your QR code. You can also adjust error correction levels (M, Q, H) to ensure seamless scanner readability."
                },
                {
                  q: "What export file formats can I download?",
                  a: "Simple QR lets you export high-resolution PNG images, vector SVG files (perfect for graphic designers and large print materials like posters and flyers), and PDF documents."
                },
                {
                  q: "Does Simple QR support Singapore PayNow QR code generation?",
                  a: "Yes! Simple QR includes dedicated support for PayNow (Singapore) QR codes, allowing local businesses, freelancers, and individuals to quickly generate scan-to-pay QR codes."
                }
              ].map((faq, idx) => (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.a}
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
                  Why We Built Simple QR
                </h2>
                <MdLightbulb className="w-16 h-16 text-amber-500 mx-auto mb-6" />
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
                      Need a quick QR code for a project or business card? Most web tools online follow the same frustrating model:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <MdClose className="text-red-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Sneaky monthly subscriptions for standard utility tasks
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdClose className="text-red-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          "Free trials" requiring your credit card details upfront
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdClose className="text-red-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Forced user registration and email spam
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdClose className="text-red-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Watermarks and low-quality download traps
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdClose className="text-red-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Intrusive ads and background data selling
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
                      Generating a static QR code is a simple mathematical algorithm. Simple QR was created with a clear, user-centric promise:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">100% Free Forever</strong> - Zero hidden costs or subscriptions
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Zero Sign-Up</strong> - Instant access with no account needed
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Client-Side Privacy</strong> - Data stays entirely in your browser
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Ad-Free Design</strong> - Clean, distraction-free interface
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Open Source</strong> - Community driven and transparent
                        </span>
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white">Pro Customization</strong> - Custom logos, vector exports & colors
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
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                    Built with <MdFavorite className="text-red-500" /> by OurCodeLab
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    We believe essential web utilities should be free, accessible, and respectful of user privacy.
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