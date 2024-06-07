'use client'
import React from 'react'

const page = () => {
  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      alert('Enter key was pressed');
      alert('Enter key was pressed');
    }
  }
  return (
    <div>
      <input type="text" onFocus={handleKeyDown} onKeyDown={handleKeyDown} />
    </div>
  )
}

export default page