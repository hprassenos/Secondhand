'use client'

import { useState, useEffect, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import type { Tag } from '@/types'

interface TagInputProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  maxTags?: number
  placeholder?: string
}

export default function TagInput({
  selectedTags,
  onTagsChange,
  maxTags = 15,
  placeholder = 'Add tags...',
}: TagInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch tag suggestions
  useEffect(() => {
    if (input.trim().length < 1) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .ilike('name', `${input}%`)
        .order('usage_count', { ascending: false })
        .limit(10)

      if (!error && data) {
        // Filter out already selected tags
        const filtered = data.filter(
          tag => !selectedTags.find(t => t.id === tag.id)
        )
        setSuggestions(filtered)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(debounce)
  }, [input, selectedTags])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = async (tag: Tag | string) => {
    if (selectedTags.length >= maxTags) {
      return
    }

    let tagToAdd: Tag

    if (typeof tag === 'string') {
      // Create new tag
      const tagName = tag.trim().toLowerCase()

      // Check if tag already exists
      const { data: existingTag } = await supabase
        .from('tags')
        .select('*')
        .eq('name', tagName)
        .single()

      if (existingTag) {
        tagToAdd = existingTag
      } else {
        // Create new tag
        const { data: newTag, error } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single()

        if (error || !newTag) {
          console.error('Error creating tag:', error)
          return
        }

        tagToAdd = newTag
      }
    } else {
      tagToAdd = tag
    }

    // Check if tag is already selected
    if (selectedTags.find(t => t.id === tagToAdd.id)) {
      return
    }

    onTagsChange([...selectedTags, tagToAdd])
    setInput('')
    setSuggestions([])
    setShowSuggestions(false)
    setActiveSuggestionIndex(0)
  }

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (showSuggestions && suggestions.length > 0) {
        addTag(suggestions[activeSuggestionIndex])
      } else if (input.trim()) {
        addTag(input.trim())
      }
    } else if (e.key === 'Backspace' && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <div className="min-h-[42px] border border-vintage-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-vintage-500 focus-within:border-vintage-500 bg-white">
        <div className="flex flex-wrap gap-2 items-center">
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-vintage-100 text-vintage-700"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:text-vintage-900"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length === 0 ? placeholder : ''}
            disabled={selectedTags.length >= maxTags}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {selectedTags.length} / {maxTags} tags
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || input.trim()) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-vintage-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            suggestions.map((tag, index) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag)}
                className={`w-full text-left px-4 py-2 hover:bg-vintage-50 ${
                  index === activeSuggestionIndex ? 'bg-vintage-100' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{tag.name}</span>
                  <span className="text-xs text-gray-500">{tag.usage_count} uses</span>
                </div>
              </button>
            ))
          ) : (
            input.trim() && (
              <button
                type="button"
                onClick={() => addTag(input.trim())}
                className="w-full text-left px-4 py-2 hover:bg-vintage-50"
              >
                <span className="text-sm">
                  Create tag: <span className="font-semibold">{input.trim()}</span>
                </span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
