import React from 'react'

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', baseUrl: 'https://facebook.com/', placeholder: 'username' },
  { id: 'instagram', name: 'Instagram', baseUrl: 'https://instagram.com/', placeholder: 'username' },
  { id: 'twitter', name: 'Twitter/X', baseUrl: 'https://twitter.com/', placeholder: 'username' },
  { id: 'linkedin', name: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', placeholder: 'username' },
  { id: 'youtube', name: 'YouTube', baseUrl: 'https://youtube.com/', placeholder: '@channel or channel/UCxxxx' },
  { id: 'tiktok', name: 'TikTok', baseUrl: 'https://tiktok.com/@', placeholder: 'username' },
  { id: 'telegram', name: 'Telegram', baseUrl: 'https://t.me/', placeholder: 'username' },
  { id: 'whatsapp', name: 'WhatsApp', baseUrl: 'https://wa.me/', placeholder: '1234567890' },
  { id: 'discord', name: 'Discord', baseUrl: 'https://discordapp.com/users/', placeholder: 'user-id' },
  { id: 'custom', name: 'Custom URL', baseUrl: '', placeholder: 'https://example.com/profile' }
]

export default function SocialForm({ data, onChange }) {
  const updateQRString = (socialData) => {
    const { platform, username } = socialData
    
    if (!username || !platform) {
      return ''
    }

    const selectedPlatform = socialPlatforms.find(p => p.id === platform)
    if (!selectedPlatform) {
      return ''
    }

    if (platform === 'custom') {
      // For custom URLs, use the username as the full URL
      return username.startsWith('http') ? username : `https://${username}`
    }

    return `${selectedPlatform.baseUrl}${username}`
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

  const selectedPlatform = socialPlatforms.find(p => p.id === data.platform) || socialPlatforms[0]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Social Platform *
        </label>
        <select
          value={data.platform || 'facebook'}
          onChange={(e) => handleChange('platform', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {socialPlatforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {selectedPlatform.id === 'custom' ? 'Profile URL *' : 'Username/Handle *'}
        </label>
        <div className="flex">
          {selectedPlatform.id !== 'custom' && (
            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg">
              {selectedPlatform.baseUrl}
            </span>
          )}
          <input
            type="text"
            value={data.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder={selectedPlatform.placeholder}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              selectedPlatform.id !== 'custom' ? 'rounded-r-lg' : 'rounded-lg'
            }`}
            required
          />
        </div>
        
        {selectedPlatform.id === 'whatsapp' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter phone number with country code (e.g., 1234567890 for +1-234-567-890)
          </p>
        )}
        
        {selectedPlatform.id === 'discord' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter your Discord user ID (found in User Settings → Advanced → Developer Mode)
          </p>
        )}
        
        {selectedPlatform.id === 'youtube' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter @channelname or channel/UCxxxxxxx or c/customname
          </p>
        )}
      </div>

      {data.platform && data.username && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Preview URL:</span><br />
            <span className="text-blue-600 dark:text-blue-400 break-all">
              {updateQRString(data)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}