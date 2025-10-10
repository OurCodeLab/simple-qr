import React from 'react'

export default function EmailForm({ data, onChange }) {
  const updateQRString = (emailData) => {
    const { email, subject, body } = emailData
    if (!email) {
      return ''
    }

    let qrString = `mailto:${email}`
    const params = []
    
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
    if (body) params.push(`body=${encodeURIComponent(body)}`)
    
    if (params.length > 0) {
      qrString += `?${params.join('&')}`
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
          Email Address *
        </label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="contact@example.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject (Optional)
        </label>
        <input
          type="text"
          value={data.subject || ''}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Email subject"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={data.body || ''}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Pre-filled email message"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}