import React, { useState, useEffect, useRef } from 'react';
import './Video.css';
import ReactPlayer from 'react-player'

const Video = ({ videoUrl, style }) => {
    return <ReactPlayer
        url={videoUrl}
        controls
        playing={true}
        width="100%"
        height="100%"
        style={style}
    />
};

export default Video;
