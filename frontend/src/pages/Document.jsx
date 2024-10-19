import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Document = ({ audioId }) => {
  audioId = "67133527ca92af6673fd629a";

  const [audioURL, setAudioURL] = useState('');
  useEffect(() => {
    const getAudioData = async () => {
      try {
        const response = await axios.get(`/api/audio/${audioId}`);
        console.log(response);
        const data = response.data;
        console.log(data);
        setAudioURL(data.s3AudioUrl);
        console.log(data.s3AudioUrl);
      } catch (error) {
        console.error('Error fetching audio data:', error.message);
      }
    };
    getAudioData();
  }, []);
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <h1 className='text-7xl'>Document</h1>
      {audioURL && 
        <audio controls>
          <source src={audioURL} type='audio/mp3' />
        </audio>
      }
    </div>
  )
}

export default Document
