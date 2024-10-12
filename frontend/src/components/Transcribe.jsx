import React, { useEffect, useRef, useState } from 'react'
import { MessageTypes } from '../utils/data'

const Transcribe = ({ audioURL }) => {
  // const [file, setFile] = useState(null)
  // const [audioStream, setAudioStream] = useState(null)
  const [output, setOutput] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const [typedOutput, setTypedOutput] = useState('');

  const worker = useRef(null)
  const typingIntervalRef = useRef(null);
  const currentTypedIndex = useRef(0);

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
          let result = e.data.results
          const lastResult = result.slice(-1)
          if(['.', ',', '!', '?', ';', ':'].includes(lastResult)) {
              result = result.slice(0, -1);
          }
          setOutput(result)
          console.log(result)
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

  useEffect(() => {
    // Start or continue typing effect whenever output updates
    if (output && currentTypedIndex.current < output.length) {
      startTypingEffect(output);
    }
  }, [output]);

  const startTypingEffect = (text) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    typingIntervalRef.current = setInterval(() => {
      if (currentTypedIndex.current < text.length) {
        const nextChar = text[currentTypedIndex.current];
        if (nextChar !== undefined && nextChar !== null) {
          setTypedOutput((prev) => prev + nextChar); // Append next character if valid
          currentTypedIndex.current++;
        }
      } else {
        clearInterval(typingIntervalRef.current);
      }
    }, 50); // Adjust the typing speed here (milliseconds per character)
  };

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
    <div className='flex flex-col items-center justify-center'>
      <button
        className="mt-4 px-4 py-2 text-white rounded-lg bg-orange-500 hover:bg-orange-600 hover:shadow-md duration-200"
        onClick={handleFormSubmission}
      >
        Transcribe
      </button>
      {/* {downloading && <p>Downloading...</p>}
      {loading && <p>Loading...</p>} */}
      <div className="mt-4 w-full p-4 max-w-96 max-h-[300px] overflow-auto shadow-md shadow-orange-500 border-2 border-black text-left rounded-xl">
        {typedOutput && (
          <p className="text-md ">{typedOutput}</p>
        )}
      </div>
    </div>
  )
}

export default Transcribe
