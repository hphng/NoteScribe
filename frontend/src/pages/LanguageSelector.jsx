import React from 'react';
import { LANGUAGES } from '../utils/data.js';

export default function LanguageSelector({ type, onChange, defaultLanguage }) {
  return (
    <div className='shadow-md shadow-orange-500 border-2  border-black text-left rounded-lg w-full'>
      {/* <label>{type}: </label> */}
      <select
        onChange={onChange}
        defaultValue={defaultLanguage}
        className='scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-orange-500 scrollbar-track-orange-200
                  rounded-lg flex-grow w-full p-2 bg-orange-100'
      >
        {Object.entries(LANGUAGES).map(([key, value]) => {
          return <option key={key} value={value}>{key}</option>
        })}
      </select>
    </div>
  )
}