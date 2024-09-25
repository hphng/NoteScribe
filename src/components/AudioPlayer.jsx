import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import {useLocation} from 'react-router-dom'

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  //get the current location
  const location = useLocation();
  const {audioURL, audioDuration} = location.state || {};

  //play and pause audio
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

  useEffect(() => {
    const audio = audioRef.current;
    if(!audioDuration){
      audioDuration = audio.duration;
    }

    const updateDuration = () => setDuration(audioDuration);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
      }${seconds}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold pb-4">Your <span className='bold text-orange-500'>Scribe</span></h1>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} preload="auto">
        <source src={audioURL} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="w-auto p-2 bg-transparent border-2 border-black shadow-md shadow-orange-500 rounded-xl flex flex-row">
        <button
          onClick={togglePlayPause}
          className="text-black w-8 aspect-square rounded-full fa-sm bg-orange-500/50 hover:bg-orange-500/80 flex items-center justify-center"
        >
          {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
        </button> 

        <div className="flex items-center px-3 space-x-2 relative">
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
      </div>
    </div>
  );
};

export default AudioPlayer;