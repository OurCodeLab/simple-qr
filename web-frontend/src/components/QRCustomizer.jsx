import React, { useRef, useState } from 'react'
import colors from '../data/colors'

export default function QRCustomizer({ options, onOptionsChange }) {
    const logoInputRef = useRef(null)
    const [isLogoDragging, setIsLogoDragging] = useState(false)

    const handleOptionChange = (key, value) => {
        onOptionsChange({
            ...options,
            [key]: value
        })
    }

    const handleMutliOptionChange = (newOptions) => {
        onOptionsChange({
            ...options,
            ...newOptions
        })
    }

    const processLogoFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                handleOptionChange('logo', e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLogoUpload = (event) => {
        const file = event.target.files[0]
        processLogoFile(file)
    }

    const handleLogoDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLogoDragging(true)
    }

    const handleLogoDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLogoDragging(false)
    }

    const handleLogoDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleLogoDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLogoDragging(false)
        
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            processLogoFile(files[0])
        }
    }

    const removeLogo = () => {
        handleOptionChange('logo', null)
        if (logoInputRef.current) {
            logoInputRef.current.value = ''
        }
    }

    return (
        <div className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Customize QR Code
            </h3>

            <div className="space-y-6">
                {/* Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Size: {options.size}px
                    </label>
                    <input
                        type="range"
                        min="200"
                        max="800"
                        step="50"
                        value={options.size}
                        onChange={(e) => handleOptionChange('size', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-range"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((options.size - 200) / (800 - 200)) * 100}%, #e5e7eb ${((options.size - 200) / (800 - 200)) * 100}%, #e5e7eb 100%)`
                        }}
                    />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            QR Code Color (Foreground)
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="color"
                                value={options.fgColor}
                                onChange={(e) => handleOptionChange('fgColor', e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={options.fgColor}
                                onChange={(e) => handleOptionChange('fgColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                placeholder="#000000"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Color of the QR code pattern
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Color
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="color"
                                value={options.bgColor}
                                onChange={(e) => handleOptionChange('bgColor', e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={options.bgColor}
                                onChange={(e) => handleOptionChange('bgColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                placeholder="#ffffff"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Background color behind the QR code
                        </p>
                    </div>
                </div>

                {/* Error Correction */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Error Correction Level
                    </label>
                    <select
                        value={options.errorCorrection}
                        onChange={(e) => handleOptionChange('errorCorrection', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Higher levels allow for better logo integration but create denser codes
                    </p>
                </div>

                {/* Margin */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Margin: {options.margin}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={options.margin}
                        onChange={(e) => handleOptionChange('margin', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-range"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(options.margin / 10) * 100}%, #e5e7eb ${(options.margin / 10) * 100}%, #e5e7eb 100%)`
                        }}
                    />
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo (Optional)
                    </label>
                    <div className="space-y-3">
                        <div 
                            className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 backdrop-blur-sm ${
                                isLogoDragging 
                                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 shadow-lg shadow-blue-500/20' 
                                    : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400/80 dark:hover:border-gray-500/80 bg-white/30 dark:bg-gray-800/30'
                            }`}
                            onDragEnter={handleLogoDragEnter}
                            onDragLeave={handleLogoDragLeave}
                            onDragOver={handleLogoDragOver}
                            onDrop={handleLogoDrop}
                        >
                            <div className="text-center">
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                
                                <div className="mb-2">
                                    <div className={`text-2xl mb-1 transition-transform duration-200 ${isLogoDragging ? 'scale-110' : ''}`}>
                                        🖼️
                                    </div>
                                    <p className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                                        isLogoDragging 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {isLogoDragging ? 'Drop logo here' : 'Drag & drop logo'}
                                    </p>
                                </div>
                                
                                <label
                                    htmlFor="logo-upload"
                                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Choose Logo
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    PNG, JPG, SVG supported
                                </p>
                            </div>
                        </div>

                        {options.logo && (
                            <>
                                <div className="flex justify-center">
                                    <img
                                        src={options.logo}
                                        alt="Logo preview"
                                        className="w-16 h-16 object-contain border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Logo Size: {options.logoSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="30"
                                        max="120"
                                        step="10"
                                        value={options.logoSize}
                                        onChange={(e) => handleOptionChange('logoSize', parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-range"
                                        style={{
                                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((options.logoSize - 30) / (120 - 30)) * 100}%, #e5e7eb ${((options.logoSize - 30) / (120 - 30)) * 100}%, #e5e7eb 100%)`
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={removeLogo}
                                    className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
                                >
                                    Remove Logo
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Color Presets */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Presets
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2">
                        {colors.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    // handleOptionChange('fgColor', preset.fg)
                                    // handleOptionChange('bgColor', preset.bg)

                                    handleMutliOptionChange({ fgColor: preset.fg, bgColor: preset.bg })
                                }}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 min-h-[60px] flex flex-col justify-center"
                                title={preset.name}
                            >
                                <div
                                    className="w-full h-5 sm:h-6 rounded mb-1"
                                    style={{
                                        background: `linear-gradient(45deg, ${preset.fg} 50%, ${preset.bg} 50%)`
                                    }}
                                />
                                <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                                    {preset.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}