import React, { useState } from 'react'
import TextForm from './forms/TextForm'
import URLForm from './forms/URLForm'
import EmailForm from './forms/EmailForm'
import PhoneForm from './forms/PhoneForm'
import SMSForm from './forms/SMSForm'
import WiFiForm from './forms/WiFiForm'
import VCardForm from './forms/VCardForm'
import CalendarForm from './forms/CalendarForm'
import SocialForm from './forms/SocialForm'
import PayNowForm from './forms/PayNowForm'
import FileForm from './forms/FileForm'

export default function QRTypeSelector({ types, selectedType, onTypeSelect, onDataChange, onFormDataChange }) {
  const [formData, setFormData] = useState({})

  const handleTypeSelect = (typeId) => {
    onTypeSelect(typeId)
    setFormData({})
    onDataChange('')
    if (onFormDataChange) onFormDataChange({})
  }

  const handleDataChange = (data) => {
    setFormData(data)
    onDataChange(data.qrString || '')
    if (onFormDataChange) onFormDataChange(data)
  }

  const renderForm = () => {
    const commonProps = {
      data: formData,
      onChange: handleDataChange
    }

    switch (selectedType) {
      case 'text':
        return <TextForm {...commonProps} />
      case 'url':
        return <URLForm {...commonProps} />
      case 'email':
        return <EmailForm {...commonProps} />
      case 'phone':
        return <PhoneForm {...commonProps} />
      case 'sms':
        return <SMSForm {...commonProps} />
      case 'wifi':
        return <WiFiForm {...commonProps} />
      case 'vcard':
        return <VCardForm {...commonProps} />
      case 'calendar':
        return <CalendarForm {...commonProps} />
      case 'social':
        return <SocialForm {...commonProps} />
      case 'paynow':
        return <PayNowForm {...commonProps} />
      case 'file':
        return <FileForm {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Select QR Code Type
      </h3>
      
      {/* Type Selection Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{type.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {type.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Form */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Enter Details
        </h4>
        {renderForm()}
      </div>
    </div>
  )
}