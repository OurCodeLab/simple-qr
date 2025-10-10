import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdArrowBack, MdArrowForward, MdQrCode2, MdTune, MdDragIndicator, MdCategory, MdDownload } from 'react-icons/md'

export default function MobileModal({ isOpen, onClose, children, title = "QR Code Generator" }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState([])
  const [modalHeight, setModalHeight] = useState(70) // percentage of viewport height
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(70)
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Split children into pages based on data-page attribute
    if (children && Array.isArray(children)) {
      setPages(children)
    } else if (children) {
      setPages([children])
    }
  }, [children])

  // Auto-adjust height based on content
  const autoAdjustHeight = useCallback(() => {
    if (contentRef.current && isOpen) {
      const contentHeight = contentRef.current.scrollHeight
      const headerHeight = 80 // approximate header height
      const navigationHeight = pages.length > 1 ? 80 : 0
      const indicatorHeight = pages.length > 1 ? 40 : 0
      const totalFixedHeight = headerHeight + navigationHeight + indicatorHeight

      
      const neededHeight = Math.min(
        Math.max((contentHeight + totalFixedHeight) / window.innerHeight * 100, 40), // min 40%
        90 // max 90%
      )
      
      setModalHeight(neededHeight)
    }
  }, [isOpen, pages.length])

  useEffect(() => {
    if (isOpen) {
      // Auto-adjust height when modal opens or content changes
      const timer = setTimeout(autoAdjustHeight, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, currentPage, autoAdjustHeight])

  // Handle drag events for height adjustment
  const handleDragStart = useCallback((clientY) => {
    setIsDragging(true)
    setDragStartY(clientY)
    setDragStartHeight(modalHeight)
  }, [modalHeight])

  const handleDragMove = useCallback((clientY) => {
    if (!isDragging) return
    
    const deltaY = dragStartY - clientY
    const deltaPercent = (deltaY / window.innerHeight) * 100
    const newHeight = Math.min(Math.max(dragStartHeight + deltaPercent, 30), 95)
    setModalHeight(newHeight)
  }, [isDragging, dragStartY, dragStartHeight])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDragStartY(0)
    setDragStartHeight(modalHeight)
  }, [modalHeight])

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault()
      handleDragMove(e.touches[0].clientY)
    }
  }

  // Mouse event handlers
  const handleMouseDown = (e) => {
    handleDragStart(e.clientY)
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault()
      handleDragMove(e.clientY)
    }
  }, [isDragging, handleDragMove])

  // Global event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      const handleMouseUp = () => handleDragEnd()
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mouseleave', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mouseleave', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleDragEnd])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Reset height when modal opens
  useEffect(() => {
    if (isOpen) {
      setModalHeight(70) // Reset to default
      setCurrentPage(0) // Reset to first page
    }
  }, [isOpen])

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <Motion.div
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl z-50 flex flex-col"
            style={{ 
              height: `${modalHeight}vh`,
              minHeight: '40vh',
              maxHeight: '95vh'
            }}
          >
            {/* Drag Handle */}
            <div 
              className={`flex justify-center py-2 cursor-ns-resize select-none ${
                isDragging ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              } transition-colors duration-200 rounded-t-2xl`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <MdDragIndicator className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  {currentPage === 0 ? (
                    <MdCategory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : currentPage === 1 ? (
                    <MdTune className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <MdDownload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentPage === 0 ? 'Select QR Type' : 
                     currentPage === 1 ? 'Customize Appearance' : 
                     'Generate & Download'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={autoAdjustHeight}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="Auto-fit height"
                >
                  Auto-fit
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Page Indicators */}
            {pages.length > 1 && (
              <div className="flex justify-center space-x-2 py-3 bg-gray-50 dark:bg-gray-800">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentPage
                        ? 'bg-blue-500 w-6'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentPage}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="h-full overflow-y-auto custom-scrollbar"
                >
                  <div ref={contentRef} className="p-4 pb-6">
                    {pages[currentPage]}
                  </div>
                </Motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {pages.length > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === 0
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }`}
                >
                  <MdArrowBack className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPage + 1} of {pages.length}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === pages.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === pages.length - 1
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }`}
                >
                  <span>Next</span>
                  <MdArrowForward className="w-4 h-4" />
                </button>
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  )
}