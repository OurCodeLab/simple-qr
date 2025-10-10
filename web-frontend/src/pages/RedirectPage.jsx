import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { motion } from 'framer-motion'
import { MdBusiness, MdWeb, MdPhone, MdEmail, MdLaunch, MdQrCode2, MdSms, MdWifi, MdPerson, MdEvent, MdShare, MdInsertDriveFile, MdTextsms } from 'react-icons/md'
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import config from '../../app-config'

export default function RedirectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [qrConfig, setQrConfig] = useState(null)
  const [skipRedirect, setSkipRedirect] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [actionTaken, setActionTaken] = useState(false)

  useEffect(() => {
    // Decode the QR configuration from the ID parameter
    try {
      if (!id) {
        console.error('No redirect ID provided')
        navigate('/')
        return
      }
      
      const decodedData = atob(decodeURIComponent(id))
      console.log('Decoded data:', decodedData) // Debug log
      
      try {
        // Try to parse as JSON (new format with configuration)
        const config = JSON.parse(decodedData)
        if (config.type && config.qrString) {
          setQrConfig(config)
        } else {
          // Invalid configuration
          console.error('Invalid QR configuration:', config)
          navigate('/')
          return
        }
      } catch {
        // Fallback: treat as direct URL (legacy format)
        console.log('Fallback to direct URL format')
        const isValidUrl = decodedData.startsWith('http://') || 
                          decodedData.startsWith('https://') || 
                          decodedData.startsWith('/') ||
                          decodedData.startsWith('www.') ||
                          /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/.test(decodedData)
        
        if (isValidUrl) {
          let finalUrl = decodedData
          if (!decodedData.startsWith('http://') && !decodedData.startsWith('https://') && !decodedData.startsWith('/')) {
            finalUrl = `https://${decodedData}`
          }
          setQrConfig({
            type: 'url',
            qrString: finalUrl,
            data: { url: decodedData, qrString: finalUrl }
          })
        } else {
          console.error('Invalid URL format:', decodedData)
          navigate('/')
          return
        }
      }
    } catch (error) {
      console.error('Invalid redirect ID:', error)
      navigate('/')
      return
    }
    setIsLoading(false)
  }, [id, navigate])

  const executeQRAction = useCallback(() => {
    if (!qrConfig) return
    
    setActionTaken(true)
    
    switch (qrConfig.type) {
      case 'url': {
        let finalUrl = qrConfig.qrString
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('/')) {
          finalUrl = `https://${finalUrl}`
        }
        window.location.href = finalUrl
        break
      }
        
      case 'email': {
        const emailData = qrConfig.data
        let emailUrl = `mailto:${emailData.email || ''}`
        if (emailData.subject || emailData.body) {
          const params = new URLSearchParams()
          if (emailData.subject) params.append('subject', emailData.subject)
          if (emailData.body) params.append('body', emailData.body)
          emailUrl += `?${params.toString()}`
        }
        window.location.href = emailUrl
        break
      }
        
      case 'phone':
        window.location.href = `tel:${qrConfig.data.phone || qrConfig.qrString}`
        break
        
      case 'sms': {
        const smsData = qrConfig.data
        let smsUrl = `sms:${smsData.phone || ''}`
        if (smsData.message) {
          smsUrl += `?body=${encodeURIComponent(smsData.message)}`
        }
        window.location.href = smsUrl
        break
      }
        
      case 'wifi':
        // WiFi QR codes can't be directly opened, show instructions instead
        alert('WiFi QR Code detected. Use your device\'s camera to scan the QR code to connect to the network.')
        break
        
      case 'vcard': {
        // Create vCard file and download it
        const vCardData = qrConfig.qrString
        const blob = new Blob([vCardData], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'contact.vcf'
        a.click()
        URL.revokeObjectURL(url)
        break
      }
        
      case 'calendar':
        // Calendar events can't be directly opened in all browsers, show the raw data
        navigator.clipboard?.writeText(qrConfig.qrString)
        alert('Calendar event copied to clipboard. You can import this into your calendar application.')
        break
        
      case 'text':
        // Copy text to clipboard
        navigator.clipboard?.writeText(qrConfig.qrString)
        alert('Text copied to clipboard!')
        break
        
      default:
        // For unknown types, try to open as URL or copy to clipboard
        if (qrConfig.qrString.startsWith('http')) {
          window.location.href = qrConfig.qrString
        } else {
          navigator.clipboard?.writeText(qrConfig.qrString)
          alert('Content copied to clipboard!')
        }
    }
  }, [qrConfig, setActionTaken])

  useEffect(() => {
    // Only start countdown if we have valid QR config and user hasn't skipped
    if (skipRedirect || countdown <= 0 || !qrConfig || actionTaken) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          executeQRAction()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, qrConfig, skipRedirect, actionTaken, executeQRAction])

  const handleSkipRedirect = () => {
    setSkipRedirect(true)
    navigate('/')
  }

  const handleRedirectNow = () => {
    executeQRAction()
  }

  const getQRTypeIcon = (type) => {
    switch (type) {
      case 'url': return <MdWeb className="h-8 w-8 text-blue-500" />
      case 'email': return <MdEmail className="h-8 w-8 text-red-500" />
      case 'phone': return <MdPhone className="h-8 w-8 text-green-500" />
      case 'sms': return <MdSms className="h-8 w-8 text-purple-500" />
      case 'wifi': return <MdWifi className="h-8 w-8 text-orange-500" />
      case 'vcard': return <MdPerson className="h-8 w-8 text-indigo-500" />
      case 'calendar': return <MdEvent className="h-8 w-8 text-pink-500" />
      case 'social': return <MdShare className="h-8 w-8 text-cyan-500" />
      case 'file': return <MdInsertDriveFile className="h-8 w-8 text-gray-500" />
      case 'text': return <MdTextsms className="h-8 w-8 text-yellow-600" />
      default: return <MdQrCode2 className="h-8 w-8 text-blue-500" />
    }
  }

  const getQRTypeDescription = (type) => {
    switch (type) {
      case 'url': return 'You will be redirected to this website'
      case 'email': return 'Your email client will open with this message'
      case 'phone': return 'Your phone will dial this number'
      case 'sms': return 'Your messaging app will open with this text'
      case 'wifi': return 'WiFi connection information'
      case 'vcard': return 'Contact information will be downloaded'
      case 'calendar': return 'Calendar event will be copied'
      case 'social': return 'Social media profile or content'
      case 'file': return 'File or document content'
      case 'text': return 'Text will be copied to clipboard'
      default: return 'QR code content will be processed'
    }
  }

  const getDisplayText = () => {
    if (!qrConfig) return ''
    
    switch (qrConfig.type) {
      case 'url':
        return qrConfig.qrString
      case 'email': {
        const emailData = qrConfig.data
        return `${emailData.email}${emailData.subject ? ` - ${emailData.subject}` : ''}`
      }
      case 'phone':
        return qrConfig.data.phone || qrConfig.qrString
      case 'sms': {
        const smsData = qrConfig.data
        return `${smsData.phone}${smsData.message ? ` - ${smsData.message}` : ''}`
      }
      case 'wifi': {
        const wifiData = qrConfig.data
        return `Network: ${wifiData.ssid}`
      }
      case 'vcard': {
        const vCardData = qrConfig.data
        return `${vCardData.firstName || ''} ${vCardData.lastName || ''}`.trim() || 'Contact Card'
      }
      case 'text':
        return qrConfig.qrString.length > 100 ? qrConfig.qrString.substring(0, 100) + '...' : qrConfig.qrString
      default:
        return qrConfig.qrString.length > 100 ? qrConfig.qrString.substring(0, 100) + '...' : qrConfig.qrString
    }
  }

  // Show loading while decoding URL
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Processing redirect...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // If invalid config after loading, redirect to home
  if (!qrConfig) {
    return <Navigate to="/" replace />
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Redirect Notice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 text-center"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  {getQRTypeIcon(qrConfig.type)}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {qrConfig.type.charAt(0).toUpperCase() + qrConfig.type.slice(1)} QR Code
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {getQRTypeDescription(qrConfig.type)} in <span className="font-bold text-blue-500">{countdown}</span> seconds
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {qrConfig.type === 'url' ? 'Destination:' : 'Content:'}
                </p>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                  {getDisplayText()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRedirectNow}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium inline-flex items-center justify-center gap-2"
                >
                  <MdLaunch className="h-4 w-4" />
                  {qrConfig.type === 'url' ? 'Go Now' : 
                   qrConfig.type === 'vcard' ? 'Download Contact' :
                   qrConfig.type === 'wifi' ? 'Show Instructions' :
                   qrConfig.type === 'text' || qrConfig.type === 'calendar' ? 'Copy to Clipboard' :
                   'Open Now'}
                </button>
                <button
                  onClick={handleSkipRedirect}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>

            {/* Company Promotion */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MdBusiness className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {config.site.name}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {config.site.tagline}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {config.company.description}
                </p>
              </div>

              {/* Services */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Our Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {config.company.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Social */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Get in Touch
                    </h4>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${config.company.contact.email}`}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <MdEmail className="h-4 w-4" />
                        {config.company.contact.email}
                      </a>
                      <a
                        href={`tel:${config.company.contact.phone}`}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <MdPhone className="h-4 w-4" />
                        {config.company.contact.phone}
                      </a>
                      <a
                        href={config.company.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <MdWeb className="h-4 w-4" />
                        Visit our website
                      </a>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Follow Us
                    </h4>
                    <div className="flex gap-3">
                      <a
                        href={config.company.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <FaLinkedin className="h-5 w-5" />
                      </a>
                      <a
                        href={config.company.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FaGithub className="h-5 w-5" />
                      </a>
                      <a
                        href={config.company.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <FaTwitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8">
                <a
                  href={config.site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <MdLaunch className="h-4 w-4" />
                  Visit {config.site.name}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}