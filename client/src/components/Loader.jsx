import React from 'react'

const Loader = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex items-center gap-3 text-slate-500'>
        <div className='size-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin' />
        <span className='text-sm'>Loading...</span>
      </div>
    </div>
  )
}

export default Loader