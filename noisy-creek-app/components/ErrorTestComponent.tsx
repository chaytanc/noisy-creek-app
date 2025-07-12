'use client'

import { useState } from 'react'

export default function ErrorTestComponent() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the error boundary!')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShouldThrow(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors shadow-lg"
        title="Click to test error boundary"
      >
        💥 Test Error
      </button>
    </div>
  )
}