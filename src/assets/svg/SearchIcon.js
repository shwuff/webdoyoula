import React from 'react';

const SearchIcon = ({className, active, width = 24}) => {

    const color = '#fff';

    if(active) {
        return (
            <svg className={className} fill={color} height={width}
                 role="img" viewBox="0 0 24 24" width={width}>
                <path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke={color}
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                      x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line>
            </svg>
        );
    }

    return (
        <svg className={className} fill={color} height={width}
             role="img" viewBox="0 0 24 24" width={width}>
            <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke={color}
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <line fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  x1="16.511" x2="22" y1="16.511" y2="22"></line>
        </svg>
    );
};

export default SearchIcon;