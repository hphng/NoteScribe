import React, { useEffect, useRef, useState } from 'react'
import { MessageTypes } from '../utils/data'
import Loading from './Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Transcribe = ({ audioURL }) => {
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
          if (['.', ',', '!', '?', ';', ':'].includes(lastResult)) {
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
  }, [])

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

  const exportToTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const transcribeButton = () => (
    <button
      className="mt-4 px-4 py-2 text-white rounded-lg bg-orange-500 hover:bg-orange-600 hover:shadow-md duration-200 flex items-center"
      onClick={!output && !downloading && !loading ? handleFormSubmission : undefined}
    >
      {
        finished ? (
          <div>Transcribe</div>
        ) : loading || downloading ? (
          <>
            <FontAwesomeIcon icon={faCircleNotch} className='animate-spin mr-2' />
            <div>Transcribing</div>
          </>
        ) : (
          <>
            <div>Transcribe</div>
          </>
        )
      }
    </button>
  );

  return (
    <div className='flex flex-col items-center justify-center'>
      {transcribeButton()}
      {output ? (
          <div className="mt-4 p-4 w-96 h-[300px] overflow-y-scroll shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg 
              scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200">
            {typedOutput && (
              <p className="text-md ">{typedOutput}</p>
            )}
          </div>
      ) : downloading ? (
        <div className='h-[300px]'>
          <Loading />
        </div>
      ) : null}

      {/* Export and Save Buttons */}
        <button className='mt-4 px-4 py-2 text-white rounded-lg bg-orange-500 hover:bg-orange-600 hover:shadow-md duration-200'
          onClick={exportToTxt}
        >
          export
        </button>
    </div>
  )
}

export default Transcribe
