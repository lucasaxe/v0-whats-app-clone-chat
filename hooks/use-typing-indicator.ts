"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseTypingIndicatorProps {
  onTypingChange?: (isTyping: boolean) => void
  debounceMs?: number
}

export function useTypingIndicator({ onTypingChange, debounceMs = 1000 }: UseTypingIndicatorProps = {}) {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      onTypingChange?.(true)
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to stop typing
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onTypingChange?.(false)
    }, debounceMs)
  }, [isTyping, onTypingChange, debounceMs])

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (isTyping) {
      setIsTyping(false)
      onTypingChange?.(false)
    }
  }, [isTyping, onTypingChange])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isTyping,
    startTyping,
    stopTyping,
  }
}
