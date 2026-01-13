import React from 'react'

const FormatDateTime = ({dateString}) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert 0 to 12
    hours = String(hours).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}

export default FormatDateTime;