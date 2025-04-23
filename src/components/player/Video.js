import React, { useState, useEffect, useRef } from 'react';
import './Video.css';
import PlayButton from "../../assets/icons/play-button.png";
import StopButton from "../../assets/icons/stop-button.png";
import VolumeIcon from "../../assets/icons/volume-icon.png";
import FullscreenIcon from "../../assets/icons/fullscreen-icon.png";

const Video = ({ videoUrl }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(1);
    const videoRef = useRef(null);

    useEffect(() => {
        const savedTime = localStorage.getItem('videoCurrentTime');
        if (savedTime) {
            setCurrentTime(Number(savedTime));
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            setCurrentTime(time);
            localStorage.setItem('videoCurrentTime', time);
        }
    };

    const handleCanPlay = () => {
        setIsLoading(false);
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) {
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
    };

    return (
        <div className="video-container">
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    controls={false}
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onCanPlay={handleCanPlay}
                    className="video-element"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
                <div className="video-controls">
                    <div className="top-controls">
                        <div className="left-controls">
                            <button className="volume-button" onClick={toggleMute}>
                                <img src={VolumeIcon} alt="Volume" />
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                        </div>

                        <button className="play-button" onClick={togglePlay}>
                            <img
                                src={isPlaying ? StopButton : PlayButton}
                                alt={isPlaying ? "Stop" : "Play"}
                                className="play-icon"
                            />
                        </button>

                        <button className="fullscreen-button" onClick={toggleFullscreen}>
                            <img src={FullscreenIcon} alt="Fullscreen" />
                        </button>
                    </div>

                    <div className="progress-bar" onClick={(e) => {
                        const clickPosition = (e.nativeEvent.offsetX / e.target.offsetWidth) * videoRef.current.duration;
                        videoRef.current.currentTime = clickPosition;
                    }}>
                        <div
                            className="filled"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                        <div className="progress-dot" style={{
                            left: `${(currentTime / duration) * 100}%`
                        }}></div>
                    </div>

                    <div className="bottom-controls">
                    <span className="current-time">
                        {`${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`}
                    </span>
                    <span className="total-time">
                        {`${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(Math.floor(duration % 60)).padStart(2, '0')}`}
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;
