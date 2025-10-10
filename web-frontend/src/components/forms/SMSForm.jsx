import React from 'react'

export default function SMSForm({ data, onChange }) {
  const updateQRString = (smsData) => {
    const { phone, message } = smsData
    if (!phone) {
      return ''
    }

    let qrString = `sms:${phone}`
    if (message) {
      qrString += `?body=${encodeURIComponent(message)}`
    }
    
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
          Phone Number *
        </label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1234567890"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include country code for international numbers
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Pre-filled SMS message"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}