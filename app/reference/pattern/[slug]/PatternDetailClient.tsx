'use client'

import { useState } from 'react'
import { ReferenceImage } from '@/types'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PatternDetailClientProps {
  images: ReferenceImage[]
  patternName: string
}

export default function PatternDetailClient({
  images,
  patternName,
}: PatternDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentImage = images[selectedImage]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'Escape') setLightboxOpen(false)
  }

  return (
    <>
      {/* Main Image */}
      <div className="bg-white rounded-lg border-2 border-vintage-200 overflow-hidden mb-4">
        <div
          className="aspect-square cursor-zoom-in relative group"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">
              Click to enlarge
            </span>
          </div>
        </div>

        {/* Image Info */}
        <div className="p-4 border-t border-vintage-200">
          <p className="text-sm font-medium text-vintage-900 mb-1">
            {currentImage.caption || currentImage.alt_text}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {currentImage.item_type && (
              <span className="capitalize">{currentImage.item_type}</span>
            )}
            {currentImage.view_angle && (
              <span className="capitalize">{currentImage.view_angle} view</span>
            )}
            {currentImage.source_attribution && (
              <span>Photo: {currentImage.source_attribution}</span>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImage
                  ? 'border-vintage-600 ring-2 ring-vintage-300'
                  : 'border-vintage-200 hover:border-vintage-400'
              }`}
            >
              <img
                src={image.thumbnail_url || image.image_url}
                alt={image.alt_text}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-vintage-300 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white hover:text-vintage-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeftIcon className="h-12 w-12" />
              </button>
              <button
                className="absolute right-4 text-white hover:text-vintage-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRightIcon className="h-12 w-12" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-b-lg mt-2">
              <p className="font-medium mb-1">
                {currentImage.caption || currentImage.alt_text}
              </p>
              <div className="text-sm opacity-80">
                {currentImage.item_type && (
                  <span className="capitalize">{currentImage.item_type}</span>
                )}
                {currentImage.view_angle && (
                  <span> • {currentImage.view_angle} view</span>
                )}
                {images.length > 1 && (
                  <span className="ml-4">
                    {selectedImage + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            {images.length > 1 && 'Use arrow keys to navigate • '}
            Press ESC to close
          </div>
        </div>
      )}
    </>
  )
}
