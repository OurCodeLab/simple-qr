import React from 'react'

export default function PhoneForm({ data, onChange }) {
  const handlePhoneChange = (phone) => {
    onChange({
      ...data,
      phone,
      qrString: phone ? `tel:${phone}` : ''
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="+1234567890"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include country code for international numbers (e.g., +1 for US)
        </p>
      </div>
    </div>
  )
}