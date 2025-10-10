import React from 'react'
import QRCodeGenerator from './QRCodeGenerator'
import QRTypeSelector from './QRTypeSelector'
import colors from '../data/colors'

// Step 1: QR Type Selection
export function QRTypeSelectionPage({ type, onTypeSelect, onDataChange, onFormDataChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select QR Type
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Choose what type of QR code you want to create
        </p>
      </div>
      
      <QRTypeSelector
        types={[
          { id: 'text', name: 'Text', icon: '📝' },
          { id: 'url', name: 'URL', icon: '🔗' },
          { id: 'email', name: 'Email', icon: '📧' },
          { id: 'phone', name: 'Phone', icon: '📱' },
          { id: 'sms', name: 'SMS', icon: '💬' },
          { id: 'wifi', name: 'WiFi', icon: '📶' },
          { id: 'vcard', name: 'Contact', icon: '👤' },
          { id: 'calendar', name: 'Event', icon: '📅' },
          { id: 'social', name: 'Social', icon: '📲' },
          { id: 'file', name: 'File', icon: '📎' },
        ]}
        selectedType={type}
        onTypeSelect={onTypeSelect}
        onDataChange={onDataChange}
        onFormDataChange={onFormDataChange}
      />
    </div>
  )
}

// Step 2: Customize Appearance  
export function QRCustomizerPage({ options, onOptionsChange }) {
  return (
    <div className="pb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Customize Appearance
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Personalize your QR code design
        </p>
      </div>
      
      <div className="bg-transparent border-none rounded-none shadow-none p-0">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size: {options.size}px
            </label>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={options.size}
              onChange={(e) => onOptionsChange({ ...options, size: parseInt(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-range"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => onOptionsChange({ ...options, fgColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={options.fgColor}
                  onChange={(e) => onOptionsChange({ ...options, fgColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => onOptionsChange({ ...options, bgColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={options.bgColor}
                  onChange={(e) => onOptionsChange({ ...options, bgColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    onOptionsChange({
                      ...options,
                      fgColor: preset.fg,
                      bgColor: preset.bg
                    })
                  }}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
                  title={preset.name}
                >
                  <div
                    className="w-full h-6 rounded"
                    style={{
                      background: `linear-gradient(45deg, ${preset.fg} 50%, ${preset.bg} 50%)`
                    }}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 3: Generate & Download QR Code
export function QRGeneratorPage({ data, options, type, formData }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your QR Code
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Generate, preview and download your QR code
        </p>
      </div>
      
      {data ? (
        <div className="flex justify-center">
          <QRCodeGenerator
            data={data}
            options={options}
            type={type}
            formData={formData}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No QR code data yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Go back and fill in your information to generate a QR code
          </p>
        </div>
      )}
    </div>
  )
}
