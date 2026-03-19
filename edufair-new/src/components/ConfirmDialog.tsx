'use client'

import { useState, useCallback } from 'react'
import { createContext, useContext, ReactNode } from 'react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

interface ConfirmContextType {
  confirm: (props: ConfirmDialogProps) => void
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialogProps & { id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = useCallback((props: ConfirmDialogProps) => {
    setDialog({ ...props, id: Math.random().toString() })
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!dialog) return
    
    setIsLoading(true)
    try {
      await dialog.onConfirm()
      setDialog(null)
    } finally {
      setIsLoading(false)
    }
  }, [dialog])

  const handleCancel = useCallback(() => {
    dialog?.onCancel?.()
    setDialog(null)
  }, [dialog])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog
          {...dialog}
          isLoading={isLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context
}

function ConfirmDialog({
  id,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps & { id: string; isLoading: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isDangerous
                ? 'bg-red-500/80 hover:bg-red-600 text-white disabled:opacity-50'
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
