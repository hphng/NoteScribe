import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col p-12 gap-3 w-[450px]'>
      {[0, 1, 2, 3, 4].map(val => {
        return (
          <div key={val} className={'rounded-full h-4 bg-slate-400 loading ' + `loading${val}`}></div>
        )
      })}
    </div>
  )
}

export default Loading
