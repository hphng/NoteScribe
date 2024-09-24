import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const Main = () => {
    const [recordingStatus, setRecordingStatus] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    // const [audioChunks, setAudioChunks] = useState([]);
    const [duration, setDuration] = useState(0);

    const [microphoneGranted, setMicrophoneGranted] = useState(false);

    const requestMicrophonePermission = async () => {
        try {
            //check if MediaRecorder is supported
            if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices) {
                console.error('MediaRecorder not supported in this browser');
            } else {
                console.log('MediaRecorder is supported');
            }
            //get microphone permission
            const permissionStatus = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophoneGranted(true);
            console.log('Microphone permission granted', permissionStatus);
            return permissionStatus;
        } catch (error) {
            console.error('Error in getting microphone permission', error);
        }
    }
    const startRecording = async () => {
        try {
            const stream = await requestMicrophonePermission();
            console.log('Startttttt')
            //create a new media recorder instance
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            //when data is available add it to audioChunks
            const audioChunks = [];
            recorder.ondataavailable = (e) => {
                console.log('ondataavailable event triggered', e);
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                    console.log('Audio chunk added, size:', e.data.size);
                }
            }
            //when recording stops, create a new audio blob and set it as audioURL
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                console.log('Audio Blob size:', audioBlob.size);
                const audioURL = URL.createObjectURL(audioBlob);
                setAudioURL(audioURL);
                // setAudioChunks([]);
            }

            recorder.start();
            setRecordingStatus(true);
        } catch (error) {
            console.error("error in initializing microphone", error);
        }
    }

    const stopRecording = () => {
        console.log('Stoppppp');
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecordingStatus(false);
            setDuration(0);
        }
    }


    //set interval to update duration
    useEffect(() => {
        setDuration(0);
        const interval = setInterval(() => {
            setDuration(duration => duration + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [recordingStatus]);
    return (
        <main className=''>
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <h1 className='text-6xl font-bold'>
                    Note<span className='bold text-orange-500'>Scribe</span>
                </h1>
                <p className='text-xl text-gray-500'>
                    Your personal note-taking app
                </p>
                <button onClick={recordingStatus ? stopRecording : startRecording}
                    className='flex px-4 py-2 rounded-xl items-center text-base border-2 border-black justify-between w-96 my-4 shadow-md shadow-orange-500 '>
                    <p className='text-black'>
                        {recordingStatus ? 'Recording...' : 'Start Recording'}
                    </p>
                    <div className='flex flex-row gap-2 border items-center justify-center'>
                        <p> {recordingStatus ? duration : <></>}</p>
                        <FontAwesomeIcon icon={faMicrophone} />
                    </div>
                </button>
                <div className='text-xl'>
                    Or <label className='text-orange-500 cursor-pointer hover:shadow-orange-500 hover:text-shadow-[1px_0_10px_var(--tw-shadow-color)] duration-300'>
                        upload <input className='hidden' type="file" accept='mp3' />
                    </label> a mp3 file
                </div>
            </div>
            {audioURL && (
                <div className='mt-4'>
                    <audio controls src={audioURL} />
                </div>
            )}
            <div className='min-h-screen'>

            </div>
        </main>
    )
}

export default Main;
