import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faVolumeHigh, faVolumeXmark, faDownload } from '@fortawesome/free-solid-svg-icons'
import getBlobDuration from "get-blob-duration";
import { useNavigate } from 'react-router-dom';

const DocumentDetails = () => {
  const audioId = useParams().id;
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  useEffect(() => {
    const getAudioData = async () => {
      try {
        const response = await axios.get(`/api/audio/${audioId}`);
        const data = response.data;
        console.log(data);
        setDocument(data);
      } catch (error) {
        console.error('Error fetching audio data:', error.message);
      }
    };
    getAudioData();
  }, [audioId]);

  useEffect(() => {
    if (document && document.s3AudioUrl) {
      const setAudioDuration = async () => {
        try {
          const audioResponse = await axios.get(document.s3AudioUrl, { responseType: 'blob' });
          const audioBlob = audioResponse.data;
          // Use getBlobDuration to calculate the duration
          const audioDuration = await getBlobDuration(audioBlob);
          setDuration(audioDuration);
        } catch (error) {
          console.error('Error fetching audio blob:', error.message);
        }
      };
      setAudioDuration();
    }
  }, [document]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
      }${seconds}`;
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  //handle time update on progess bar
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    const progressPercentage = parseFloat((audio.currentTime / audio.duration) * 100);
    progressBarRef.current.value = progressPercentage;
    console.log(progressBarRef.current.value);
    progressBarRef.current.style.setProperty("--seek-before-width", `${progressPercentage}%`);
  };

  //handle progress change on progress bar
  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const value = e.target.value;
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  //handle muted and unmuted
  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }

  const backToDocumentList = () => {
    navigate("/a");
    window.scrollTo(0, 0);
  }

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
      <div className="min-h-screen mt-20 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-bold text-orange-600 mb-12 text-center">{document.documentName}</h1>
        {/* audio part */}
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} preload="auto">
          <source src={document.s3AudioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        <div className="w-[80%] p-2 bg-transparent border-2 border-black shadow-md shadow-orange-500 rounded-xl mb-4 flex flex-row">
          <button
            onClick={togglePlayPause}
            className="text-black w-8 aspect-square rounded-full fa-sm bg-orange-500/50 hover:bg-orange-500/80 flex items-center justify-center"
          >
            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>

          <div className="flex items-center px-3 space-x-2 relative w-[85%]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              ref={progressBarRef}
              className="w-64 custom-range-slider"
              onChange={handleProgressChange}
              defaultValue="0"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <button
            onClick={toggleMute}
            className="text-black w-8 aspect-square rounded-full fa-sm bg-orange-500/50 hover:bg-orange-500/80 flex items-center justify-center"
          >
            {isMuted ? <FontAwesomeIcon icon={faVolumeXmark} /> : <FontAwesomeIcon icon={faVolumeHigh} />}
          </button>
          <button className="text-black ml-2 w-8 aspect-square rounded-full fa-sm bg-orange-500/50 hover:bg-orange-500/80 duration-200 flex items-center justify-center">
            <a href={document.s3AudioUrl} download>
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </button>
        </div>
        {/* transcription and translation */}
        <h2 className="text-3xl font-semibold m-4 text-orange-600">Transcription</h2>
        <div className="p-4 w-full min-h-[300px] bg-gray-100 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg">
          <p className="text-gray-700">{document.transcription || 'No transcription available'}</p>
        </div>

        <h2 className="text-3xl font-semibold m-4 text-orange-600">Translation ({document.language})</h2>
        <div className="p-4 w-full min-h-[300px] bg-gray-100 shadow-md shadow-orange-500 border-2 border-black text-left rounded-lg">
          <p className="text-gray-700">{document.translation || 'No translation available'}</p>
        </div>
        {/* back to list button */}
        <div className="flex justify-end">
          <button 
            className="my-12 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            onClick={backToDocumentList}
          >
            Back to List
          </button>
        </div>
      </div>
  );
};

export default DocumentDetails
