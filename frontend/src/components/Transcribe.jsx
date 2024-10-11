import React, {useEffect, useRef, useState} from 'react'
import { MessageTypes } from '../utils/data'
import {useLocation} from 'react-router-dom'

const Transcribe = () => {
    // const [file, setFile] = useState(null)
    // const [audioStream, setAudioStream] = useState(null)
    const [output, setOutput] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [finished, setFinished] = useState(false)

    const worker = useRef(null)

    const location = useLocation()
    let { audioURL } = location.state || {};

    useEffect(() => {
      if (!worker.current) {
        worker.current = new Worker(new URL('../utils/transcribe.js', import.meta.url), {
          type: 'module'
        })
      }
  
      const onMessageReceived = async (e) => {
        switch (e.data.type) {
          case 'DOWNLOADING':
            setDownloading(true)
            console.log('DOWNLOADING')
            break;
          case 'LOADING':
            setLoading(true)
            console.log('LOADING')
            break;
          case 'RESULT':
            setOutput(e.data.results)
            console.log(e.data.results)
            break;
          case 'INFERENCE_DONE':
            setFinished(true)
            console.log("DONE")
            break;
        }
      }
  
      worker.current.addEventListener('message', onMessageReceived)
  
      return () => worker.current.removeEventListener('message', onMessageReceived)
    })
    async function readAudioFrom(file) {
        const sampling_rate = 16000
        const audioCTX = new AudioContext({ sampleRate: sampling_rate })
        const response = await file.arrayBuffer()
        const decoded = await audioCTX.decodeAudioData(response)
        const audio = decoded.getChannelData(0)
        return audio
      }
    
      async function handleFormSubmission() {
        console.log(audioURL);
        if (!audioURL) { return }
        let response;
        if (audioURL.startsWith('blob:') || audioURL.startsWith('http')) {
          // Handle Blob URL or remote URL
          response = await fetch(audioURL);
        } else {
          // If it's a File object
          response = audioURL.arrayBuffer();
        }
    
        let audio = await readAudioFrom(response)
        const model_name = `Xenova/whisper-tiny.en`
    
        worker.current.postMessage({
          type: MessageTypes.INFERENCE_REQUEST,
          audio,
          model_name
        })
      }
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold'>Transcribe</h1>
      <button className="border-2 border-black" onClick={handleFormSubmission}>Submit</button>
      {downloading && <p>Downloading...</p>}
      {loading && <p>Loading...</p>}
      {finished && <p>{output}</p>}
    </div>
  )
}

export default Transcribe
