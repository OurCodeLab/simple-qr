import React from 'react'

export default function TextForm({ data, onChange }) {
  const handleTextChange = (text) => {
    onChange({
      ...data,
      text,
      qrString: text
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Text Content
        </label>
        <textarea
          value={data.text || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your text here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}