import React, { useMemo } from 'react';

const Avatar = ({
    name,
    size = 40,
    fontSize,
    className = '',
    style = {}
}) => {
    // Generate color palette
    const colorPalette = useMemo(() => {
        const baseColors = [
            { r: 59, g: 130, b: 246 },   // Blue
            { r: 34, g: 197, b: 94 },    // Green
            { r: 168, g: 85, b: 247 },   // Purple
            { r: 239, g: 68, b: 68 },    // Red
            { r: 245, g: 158, b: 11 },   // Orange
            { r: 6, g: 182, b: 212 },    // Cyan
            { r: 236, g: 72, b: 153 },   // Pink
            { r: 139, g: 92, b: 246 },   // Indigo
            { r: 20, g: 184, b: 166 },   // Teal
            { r: 120, g: 53, b: 15 }     // Brown
        ];

        // Pick a random base color
        const randomBaseColor = baseColors[Math.floor(Math.random() * baseColors.length)];

        // Generate light shade for background
        const bgColor = `rgb(
      ${Math.min(255, randomBaseColor.r + 100)},
      ${Math.min(255, randomBaseColor.g + 100)},
      ${Math.min(255, randomBaseColor.b + 100)}
    )`;

        // Generate dark shade for text
        const textColor = `rgb(
      ${Math.max(0, randomBaseColor.r - 30)},
      ${Math.max(0, randomBaseColor.g - 30)},
      ${Math.max(0, randomBaseColor.b - 30)}
    )`;

        return { bgColor, textColor };
    }, []); // Empty dependency array means it generates once

    // Extract initials from name
    const initials = useMemo(() => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }, [name]);

    // Calculate font size
    const calculatedFontSize = fontSize || size * 0.4;

    return (
        <div
            className={`avatar ${className}`}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: colorPalette.bgColor,
                color: colorPalette.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: calculatedFontSize,
                fontFamily: 'Google Sans Flex',
                userSelect: 'none',
                ...style
            }}
            title={name}
        >
            {initials}
        </div>
    );
};

export default Avatar;