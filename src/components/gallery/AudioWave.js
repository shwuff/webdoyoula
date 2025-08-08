import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react'; // иконки

// Форматируем время в ММ:СС
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioWave = ({ audioUrl, canPlay = true }) => {
    const containerRef = useRef(null);
    const waveRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [objectUrl, setObjectUrl] = useState(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        let objectUrlTemp = null;

        async function prepareAudio() {
            try {
                let url = audioUrl;

                // Если это blob:// ссылка, грузим через fetch и делаем Object URL
                if (audioUrl.startsWith('blob:')) {
                    const res = await fetch(audioUrl);
                    const blob = await res.blob();
                    objectUrlTemp = URL.createObjectURL(blob);
                    setObjectUrl(objectUrlTemp);
                    url = objectUrlTemp;
                }

                waveRef.current = WaveSurfer.create({
                    container: containerRef.current,
                    waveColor: '#ccc',
                    progressColor: '#007bff',
                    cursorColor: '#fff',
                    height: canPlay ? 80 : 10,
                    barWidth: 2,
                    responsive: true,
                    backend: 'MediaElement',
                });

                waveRef.current.load(url);

                waveRef.current.on('ready', () => {
                    setIsReady(true);
                    setTotalDuration(waveRef.current.getDuration());
                });

                // Обновляем текущее время во время воспроизведения
                waveRef.current.on('audioprocess', () => {
                    setCurrentTime(waveRef.current.getCurrentTime());
                });

                // Обновляем при перемотке (щелчок по волне)
                waveRef.current.on('seek', () => {
                    setCurrentTime(waveRef.current.getCurrentTime());
                });

                // Отслеживаем play/pause события
                waveRef.current.on('play', () => setIsPlaying(true));
                waveRef.current.on('pause', () => setIsPlaying(false));
                waveRef.current.on('finish', () => {
                    setIsPlaying(false);
                    setCurrentTime(totalDuration);
                });
            } catch (e) {
                console.error('Audio load error', e);
            }
        }

        prepareAudio();

        return () => {
            if (waveRef.current) {
                waveRef.current.destroy();
                waveRef.current = null;
            }
            if (objectUrlTemp) {
                URL.revokeObjectURL(objectUrlTemp); // чистим память
            }
        };
    }, [audioUrl, totalDuration]);

    const togglePlay = () => {
        if (isReady && waveRef.current) {
            waveRef.current.playPause();
        }
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: canPlay ? '0 70px' : "0 20px",
                flexDirection: 'column',
                minHeight: canPlay ? '30vh' : '0',
            }}
        >
            <div className="w-100">
                <div ref={containerRef}></div>

                {
                    canPlay && (
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                color: '#aaa',
                                fontSize: '14px',
                                marginTop: '5px',
                                padding: '0 5px',
                                fontFamily: 'monospace',
                            }}
                        >
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(totalDuration)}</span>
                        </div>
                    )
                }

                {canPlay ? (
                    <div
                        className="w-100 d-flex align-items-center justify-content-center"
                        style={{ marginTop: '10px' }}
                    >
                        <button
                            disabled={!isReady}
                            onClick={togglePlay}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                            }}
                        >
                            {isPlaying ? <Pause size={36} /> : <Play size={36} />}
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-100 d-flex align-items-center justify-content-center"
                        style={{ marginTop: '10px' }}
                    >
                        <button
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                            }}
                        >
                            <Play size={36} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioWave;
