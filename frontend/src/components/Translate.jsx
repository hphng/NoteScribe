import React, { useState, useRef, useEffect } from 'react'
import LanguageSelector from '../pages/LanguageSelector';
import Progress from '../pages/Progress';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Translate = ({ text }) => {
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
  }


  return (
    <div className="flex flex-col justify-center items-center w-full pt-8">
      <div className='w-full'>
        <div className='language-container w-full flex flex-row justify-evenly gap-44 '>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
          <LanguageSelector type={"Target"} defaultLanguage={"fra_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
        </div>

        <div className='textbox-container flex flex-row justify-evenly gap-44'>
          <textarea
            value={text} onChange={e => setInput(e.target.value)}
            className="mt-4 p-4 w-96 overflow-y-scroll bg-orange-50 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg 
                      scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200"></textarea>
          <textarea
            value={output} readOnly
            className="mt-4 p-4 w-96 h-[300px] overflow-y-scroll bg-orange-100 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg 
                      scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200"></textarea>
        </div>
      </div>

      <button disabled={disabled} onClick={translate}
        className=' absolute fa-4x text-orange-500 hover:text-orange-600 hover:scale-125 duration-200 flex items-center'
      >
        {ready ? (
          <FontAwesomeIcon icon={faArrowRight} />
        ) : (
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
        )}
      </button>

      <div className='absolute top-2/3'>
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Translate;
