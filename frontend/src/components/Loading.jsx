import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center text-center'>
      <div className='flex flex-col pb-10'>
        <h1 className='font-bold text-7xl text-orange-500'>Transcribing</h1>
        <p className='text-xl text-gray-500'>warming up cylinders</p>
      </div>
      <div className='flex flex-col gap-3 max-w-[600px] w-full'>
        {[0, 1, 2].map(val => {
          return (
            <div key={val} className={'rounded-full h-4 bg-slate-400 loading ' + `loading${val}`}></div>
          )
        })}
      </div>
    </div>
  )
}

export default Loading
