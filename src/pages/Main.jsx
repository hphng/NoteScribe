import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const Main = () => {
    return (
        <main className=''>
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <h1 className='text-6xl font-bold'>
                    Note<span className='bold text-orange-500'>Scribe</span>
                </h1>
                <p className='text-xl text-gray-500'>
                    Your personal note-taking app
                </p>
                <button className='flex px-4 py-2 rounded-xl items-center text-base border-2 border-black justify-between w-96 my-4 shadow-md shadow-orange-500 '>
                    <p className='text-black'>Record</p>
                    <FontAwesomeIcon icon={faMicrophone} />
                </button>
                <div className='text-xl'>
                    Or <label className='text-orange-500 cursor-pointer hover:shadow-orange-500 hover:text-shadow-[1px_0_10px_var(--tw-shadow-color)] duration-300'>
                        upload <input className='hidden' type="file" accept='mp3' />
                    </label> a mp3 file
                </div>
            </div>
            <div className='min-h-screen'>

            </div>
        </main>
    )
}

export default Main;
