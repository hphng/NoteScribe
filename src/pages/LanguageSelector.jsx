import React from 'react';
import {LANGUAGES} from '../utils/data.js';

export default function LanguageSelector({ type, onChange, defaultLanguage }) {
    return (
      <div className='language-selector'>
        <label>{type}: </label>
        <select onChange={onChange} defaultValue={defaultLanguage}>
          {Object.entries(LANGUAGES).map(([key, value]) => {
            return <option key={key} value={value}>{key}</option>
          })}
        </select>
      </div>
    )
  }