import React from 'react'

export default function WiFiForm({ data, onChange }) {
  const updateQRString = (wifiData) => {
    const { ssid, password, security, hidden } = wifiData
    if (!ssid) {
      return ''
    }

    // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
    const securityType = security || 'WPA'
    const isHidden = hidden ? 'true' : 'false'
    
    let qrString = `WIFI:T:${securityType};S:${ssid};`
    if (password) {
      qrString += `P:${password};`
    }
    qrString += `H:${isHidden};;`
    
    return qrString
  }

  const handleChange = (field, value) => {
    const newData = {
      ...data,
      [field]: value
    }
    
    onChange({
      ...newData,
      qrString: updateQRString(newData)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Network Name (SSID) *
        </label>
        <input
          type="text"
          value={data.ssid || ''}
          onChange={(e) => handleChange('ssid', e.target.value)}
          placeholder="MyWiFiNetwork"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          value={data.password || ''}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="WiFi password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Leave empty for open networks
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Security Type
        </label>
        <select
          value={data.security || 'WPA'}
          onChange={(e) => handleChange('security', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open)</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="hidden"
          checked={data.hidden || false}
          onChange={(e) => handleChange('hidden', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hidden" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Hidden Network
        </label>
      </div>
    </div>
  )
}