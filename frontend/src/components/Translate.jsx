import React, { useState, useRef, useEffect } from 'react'
import LanguageSelector from '../pages/LanguageSelector';
import Progress from '../pages/Progress';
import { LANGUAGES } from '../utils/data';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Translate = ({ text, onTranslationComplete, onTranslateLanguage }) => {
  const [ready, setReady] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState(text);
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [output, setOutput] = useState('');
  const worker = useRef(null);
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../utils/translate.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output);
          onTranslationComplete(e.data.output);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });
  const translate = () => {
    setDisabled(true);
    worker.current.postMessage({
      text: text,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
    for (let key in LANGUAGES) {
      if (LANGUAGES[key] === targetLanguage) {
        onTranslateLanguage(key);
        break;
      }
    }
  }


  return (
    <div className="flex flex-col justify-center items-center w-full pt-8">
      <div className='w-full flex flex-row mobile:flex-col'>
        <div>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
          <textarea
            value={text} onChange={e => setInput(e.target.value)}
            className="mt-4 p-4 w-96 h-[300px] mobile:h-[200px] overflow-y-scroll bg-orange-50 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg 
                      scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200"
          ></textarea>
        </div>

        <div className='flex flex-col justify-center mobile:my-4 '>
          <button disabled={disabled} onClick={translate}
            className='mx-20 fa-4x text-orange-500 hover:text-orange-600 hover:scale-125 duration-200 flex items-center 
                    mobile:mx-0 mobile:justify-center mobile:rotate-90'
          >
            {ready ? (
              <FontAwesomeIcon icon={faArrowRight} />
            ) : (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            )}
          </button>
          <div className='text-center mobile:hidden'>
            {progressItems.map(data => (
              <div key={data.file}>
                <Progress text={data.file} percentage={data.progress} />
              </div>
            ))}
          </div>
        </div>
        <div className=' mobile:mb-28'>
          <LanguageSelector type={"Target"} defaultLanguage={"fra_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
          <textarea
            value={output} readOnly
            className="mt-4 p-4 w-96 h-[300px] mobile:h-[200px] overflow-y-scroll bg-orange-100 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg 
                      scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200"
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default Translate;
