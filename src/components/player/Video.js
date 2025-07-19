import React, { useState, useEffect, useRef } from 'react';
import './Video.css';
import ReactPlayer from 'react-player'

const Video = ({ videoUrl, className, style = {} }) => {
    return <video
        src={videoUrl}
        controls
        autoPlay
        muted
        loop
        controlsList="nodownload"
        width="100%"
        height="100%"
        className={className}
        style={style}
    />
};

export default Video;
