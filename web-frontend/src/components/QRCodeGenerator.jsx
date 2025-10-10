import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { saveAs } from 'file-saver'
import config from '../../app-config'

export default function QRCodeGenerator({ data, options, type, formData = {} }) {
  const canvasRef = useRef(null)
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [supportRedirect, setSupportRedirect] = useState(false)

  useEffect(() => {
    generateQRCode()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, options, supportRedirect])

  const getQRData = () => {
    if (!data) return ''
    
    if (supportRedirect && config.qr.redirectEnabled) {
      // Create a redirect URL with encoded QR configuration and data
      const qrConfig = {
        type: type,
        data: formData,
        qrString: data,
        timestamp: Date.now()
      }
      const encodedData = encodeURIComponent(btoa(JSON.stringify(qrConfig)))
      return `${window.location.origin}${config.qr.baseRedirectUrl}${encodedData}`
    }
    
    return data
  }

  const generateQRCode = async () => {
    const qrData = getQRData()
    if (!qrData || !canvasRef.current) return

    setIsGenerating(true)
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = options.size
      canvas.height = options.size
      
      // Generate QR code with proper color mapping
      await QRCode.toCanvas(canvas, qrData, {
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.fgColor,  // This controls the QR code modules (black parts)
          light: options.bgColor  // This controls the background (white parts)
        },
        errorCorrectionLevel: options.errorCorrection
      })

      // Add logo if provided
      if (options.logo) {
        await addLogoToQR(ctx, canvas.width, canvas.height)
      }

      // Convert to data URL for download
      const dataURL = canvas.toDataURL('image/png')
      setQrCodeDataURL(dataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addLogoToQR = (ctx, canvasWidth, canvasHeight) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const logoSize = options.logoSize
        const x = (canvasWidth - logoSize) / 2
        const y = (canvasHeight - logoSize) / 2
        
        // Draw white background circle for logo
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(canvasWidth / 2, canvasHeight / 2, logoSize / 2 + 5, 0, 2 * Math.PI)
        ctx.fill()
        
        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize)
        resolve()
      }
      img.src = options.logo
    })
  }

  const downloadQRCode = (format = 'png') => {
    if (!qrCodeDataURL) return

    const canvas = canvasRef.current
    
    switch (format) {
      case 'png':
        canvas.toBlob((blob) => {
          saveAs(blob, `qrcode-${type}.png`)
        })
        break
      case 'svg':
        downloadSVG()
        break
      case 'pdf':
        downloadPDF()
        break
    }
  }

  const downloadSVG = async () => {
    try {
      const qrData = getQRData()
      const svgString = await QRCode.toString(qrData, {
        type: 'svg',
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.fgColor,
          light: options.bgColor
        },
        errorCorrectionLevel: options.errorCorrection
      })
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      saveAs(blob, `qrcode-${type}.svg`)
    } catch (error) {
      console.error('Error generating SVG:', error)
    }
  }

  const downloadPDF = () => {
    // For PDF generation, we'll convert canvas to image and create a simple PDF structure
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      // Simple PDF generation - in a real app, you might want to use jsPDF
      saveAs(blob, `qrcode-${type}.png`) // Fallback to PNG for now
    })
  }

  const copyToClipboard = async () => {
    if (!qrCodeDataURL) return

    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])
        alert('QR code copied to clipboard!')
      } else {
        // Fallback for browsers that don't support clipboard API
        const link = document.createElement('a')
        link.href = qrCodeDataURL
        link.download = `qrcode-${type}.png`
        link.click()
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Could not copy to clipboard. The image has been downloaded instead.')
    }
  }

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-6 sticky top-20">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Your QR Code
      </h3>
      
      {/* QR Code Display or Animation */}
      <div className="flex justify-center mb-6">
        {data ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`border border-gray-200 dark:border-gray-600 rounded-lg ${
                isGenerating ? 'opacity-50' : ''
              }`}
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                  {/* Enhanced loading spinner */}
                  <div className="relative mb-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-600"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  
                  {/* Loading text with typewriter effect */}
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="inline-block animate-pulse">Generating QR Code</span>
                    <span className="inline-block animate-bounce ml-1">.</span>
                    <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Animation when no QR code data
          <div className="text-center">
            <div className="mb-6">
              {/* QR Code placeholder animation */}
              <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Animated scanning line */}
                <div className="absolute inset-0">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
                
                {/* QR Code icon */}
                <div className="text-8xl text-gray-400 dark:text-gray-500 animate-pulse">
                  📱
                </div>
                
                {/* Corner squares (QR code style) */}
                <div className="absolute top-3 left-3 w-6 h-6 border-2 border-gray-300 dark:border-gray-600 animate-pulse"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-2 border-gray-300 dark:border-gray-600 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-2 border-gray-300 dark:border-gray-600 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-fade-in">
                Ready to Generate
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Enter your data and watch the magic happen ✨
              </p>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support OurCodeLab */}
      {data && !isGenerating && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="support-redirect"
              checked={supportRedirect}
              onChange={(e) => setSupportRedirect(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="support-redirect" className="text-sm font-medium text-purple-800 dark:text-purple-200 cursor-pointer">
                Support {config.site.name}
              </label>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                By checking this, your QR code will redirect through {config.site.name}, spreading the word Simple QR. 
                Making a world a better place, one QR code at a time!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Download Buttons */}
      {data && !isGenerating && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => downloadQRCode('png')}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200"
            >
              PNG
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200"
            >
              SVG
            </button>
            <button
              onClick={() => downloadQRCode('pdf')}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors duration-200"
            >
              PDF
            </button>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
          >
            Copy to Clipboard
          </button>
          
          {/* Show current QR data */}
          {supportRedirect && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <span className="font-medium">QR Code will redirect through:</span><br />
                <span className="font-mono break-all">{getQRData()}</span>
              </p>
            </div>
          )}
        </div>
      )}


    </div>
  )
}