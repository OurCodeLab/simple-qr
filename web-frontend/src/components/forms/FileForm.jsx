import React, { useRef, useState } from 'react'

export default function FileForm({ data, onChange }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file) => {
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      onChange({
        ...data,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileData: result,
        qrString: result // For images/videos, this will be a data URL
      })
    }
    
    // For images and small files, read as data URL
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.size < 1024 * 1024) {
      reader.readAsDataURL(file)
    } else {
      // For larger files, you might want to upload to a service and use the URL
      // For now, we'll show an error
      alert('File too large. Please use files smaller than 1MB or upload to a file hosting service and use the URL option instead.')
      return
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    processFile(file)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleURLChange = (url) => {
    onChange({
      ...data,
      fileUrl: url,
      qrString: url
    })
  }

  const clearFile = () => {
    onChange({
      ...data,
      fileName: '',
      fileSize: 0,
      fileType: '',
      fileData: '',
      qrString: ''
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Method
        </label>
        <div className="space-y-3">
          <div 
            className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 backdrop-blur-sm ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 shadow-lg shadow-blue-500/20' 
                : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400/80 dark:hover:border-gray-500/80 bg-white/30 dark:bg-gray-800/30'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*,video/*,.pdf,.txt,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              
              <div className="mb-4">
                <div className={`text-4xl mb-2 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
                  📁
                </div>
                <p className={`text-lg font-medium mb-2 transition-colors duration-200 ${
                  isDragging 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Choose File
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: Images, videos, documents (max 1MB)
                </p>
              </div>
              
              {data.fileName && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        {data.fileName}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {formatFileSize(data.fileSize)} • {data.fileType}
                      </p>
                    </div>
                    <button
                      onClick={clearFile}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {data.fileData && data.fileType.startsWith('image/') && (
                    <div className="mt-2 flex justify-center">
                      <img 
                        src={data.fileData} 
                        alt="Preview" 
                        className="max-w-32 max-h-32 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-gray-500 dark:text-gray-400">
            <span className="text-sm">OR</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File URL
            </label>
            <input
              type="url"
              value={data.fileUrl || ''}
              onChange={(e) => handleURLChange(e.target.value)}
              placeholder="https://example.com/file.pdf"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Link to a file hosted online (images, documents, videos, etc.)
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> For files, the QR code will contain either the file content (for small files) or a URL to the file. 
          Large files should be uploaded to a cloud service and the share link used instead.
        </p>
      </div>
    </div>
  )
}