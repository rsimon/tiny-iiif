// src/hooks/use-toast.ts
import { useState, useCallback } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

let toastCount = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(({ 
    title, 
    description, 
    variant = 'default',
    duration = 5000 
  }: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCount}`
    const newToast: Toast = { id, title, description, variant, duration }

    setState((prev) => ({
      toasts: [...prev.toasts, newToast]
    }))

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id)
    }))
  }, [])

  const dismissAll = useCallback(() => {
    setState({ toasts: [] })
  }, [])

  return {
    toast,
    toasts: state.toasts,
    dismiss,
    dismissAll
  }
}