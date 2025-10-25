import React from 'react'

export default function PayNowForm({ data, onChange }) {
  const generatePayNowQRString = (payNowData) => {
    const { payeeType, payeeId, amount, reference } = payNowData
    
    if (!payeeId) return ''

    let qrString = ''

    // Payload Format Indicator
    qrString += '000201'

    // Point of Initiation Method (Static QR = 11, Dynamic QR = 12)
    qrString += '010211'

    // Merchant Account Information for PayNow (Tag 26)
    let payNowContent = ''
    payNowContent += '0009SG.PAYNOW' // Tag 00 - PayNow ID
    payNowContent += '0101' + (payeeType === 'mobile' ? '0' : '2') // Tag 01 - Proxy Type

    let proxyValue = payeeId
    if (payeeType === 'mobile') {
      proxyValue = payeeId.replace(/^\+/, '') // Remove "+" sign for internal PayNow format
    }

    payNowContent += '02' + String(proxyValue.length).padStart(2, '0') + proxyValue // Tag 02 - Proxy Value
    payNowContent += '03010' // Tag 03 - Editable (0 = editable amount)

    // Combine as Tag 26
    const merchantInfo = '26' + String(payNowContent.length).padStart(2, '0') + payNowContent
    qrString += merchantInfo

    // Transaction Currency (SGD = 702)
    qrString += '5303702'

    // Transaction Amount (if provided)
    if (amount && parseFloat(amount) > 0) {
      const amountStr = parseFloat(amount).toFixed(2)
      qrString += '54' + String(amountStr.length).padStart(2, '0') + amountStr
    }

    // Country Code
    qrString += '5802SG'

    // Merchant Name
    qrString += '5902NA'

    // Merchant City
    qrString += '6009SINGAPORE'

    // Additional Data Field (for reference)
    if (reference) {
      const refField = '01' + String(reference.length).padStart(2, '0') + reference
      qrString += '62' + String(refField.length).padStart(2, '0') + refField
    }

    // Add CRC placeholder
    qrString += '6304'

    // Compute CRC16 checksum (ISO/IEC 13239 / CCITT-FALSE)
    const crc = calculateCRC16(qrString)
    qrString += crc

    return qrString
  }

  
  const calculateCRC16 = (data) => {
    let crc = 0xFFFF
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF
        } else {
          crc = (crc << 1) & 0xFFFF
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0')
  }

  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value }
    onChange({ ...newData, qrString: generatePayNowQRString(newData) })
  }

  const formatMobileNumber = (mobile) => {
    const digits = mobile.replace(/\D/g, '')
    if (digits.startsWith('65')) return '+' + digits
    if (digits.startsWith('8') || digits.startsWith('9')) return '+65' + digits
    return '+65' + digits
  }

  const validateUEN = (uen) => /^[0-9]{8,10}[A-Z]$/.test(uen.replace(/\s/g, ''))

  const validateMobile = (mobile) => {
    const cleaned = mobile.replace(/\D/g, '')
    return cleaned.length >= 8 && (cleaned.startsWith('65') || cleaned.startsWith('8') || cleaned.startsWith('9'))
  }

  return (
    <div className="space-y-4">
      {/* Payee Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payee Type *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleChange('payeeType', 'mobile')}
            className={`p-2 rounded-lg border-2 transition-all ${
              data.payeeType === 'mobile'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">Mobile Number</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('payeeType', 'uen')}
            className={`p-2 rounded-lg border-2 transition-all ${
              data.payeeType === 'uen'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">UEN</span>
          </button>
        </div>
      </div>

      {/* Mobile Field */}
      {data.payeeType === 'mobile' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            value={data.payeeId || ''}
            onChange={(e) => handleChange('payeeId', formatMobileNumber(e.target.value))}
            placeholder="+65 8123 4567"
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              data.payeeId && !validateMobile(data.payeeId)
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Singapore mobile number (auto-formats with +65)
          </p>
        </div>
      )}

      {/* UEN Field */}
      {data.payeeType === 'uen' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            UEN (Unique Entity Number) *
          </label>
          <input
            type="text"
            value={data.payeeId || ''}
            onChange={(e) => handleChange('payeeId', e.target.value.toUpperCase())}
            placeholder="201234567D"
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              data.payeeId && !validateUEN(data.payeeId)
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Singapore UEN format (e.g., 201234567D)
          </p>
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount (SGD) (Optional)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={data.amount || ''}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Leave empty for recipient to enter amount
        </p>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reference/Description (Optional)
        </label>
        <input
          type="text"
          maxLength="25"
          value={data.reference || ''}
          onChange={(e) => handleChange('reference', e.target.value)}
          placeholder="Payment description"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Optional payment reference (max 25 characters)
        </p>
      </div>

      {!data.payeeType && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Select payee type to start creating your PayNow QR code
          </p>
        </div>
      )}
    </div>
  )
}
