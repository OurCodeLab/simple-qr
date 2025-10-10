import React from 'react'

export default function URLForm({ data, onChange }) {
  const handleURLChange = (url) => {
    // Auto-prepend https:// if no protocol is specified
    let formattedURL = url
    if (url && !url.match(/^https?:\/\//)) {
      formattedURL = `https://${url}`
    }
    
    onChange({
      ...data,
      url: url,
      qrString: formattedURL
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website URL
        </label>
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => handleURLChange(e.target.value)}
          placeholder="example.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          https:// will be automatically added if not provided
        </p>
      </div>
    </div>
  )
}