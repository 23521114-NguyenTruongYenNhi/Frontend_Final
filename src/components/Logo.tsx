import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
            >
                {/* Chef Hat Base */}
                <path
                    d="M12 32C12 32 14 28 16 28C18 28 19 30 21 30C23 30 24 28 26 28C28 28 29 30 31 30C33 30 34 28 36 28C38 28 40 32 40 32V38C40 39.1046 39.1046 40 38 40H14C12.8954 40 12 39.1046 12 38V32Z"
                    fill="#f97316"
                />

                {/* Chef Hat Puff - Left */}
                <circle cx="16" cy="18" r="8" fill="#ffffff" stroke="#f97316" strokeWidth="2" />

                {/* Chef Hat Puff - Center */}
                <circle cx="24" cy="14" r="9" fill="#ffffff" stroke="#f97316" strokeWidth="2" />

                {/* Chef Hat Puff - Right */}
                <circle cx="32" cy="18" r="8" fill="#ffffff" stroke="#f97316" strokeWidth="2" />

                {/* Spoon Accent */}
                <path
                    d="M30 22C30 22 31 24 32 26C32.5 27 33 28 34 28C35 28 35 27 35 26C35 25 34 24 33 23L30 22Z"
                    fill="#fbbf24"
                    stroke="#f97316"
                    strokeWidth="1"
                />

                {/* Star Accent */}
                <path
                    d="M20 10L20.5 11.5L22 12L20.5 12.5L20 14L19.5 12.5L18 12L19.5 11.5L20 10Z"
                    fill="#fbbf24"
                />
            </svg>

            <div className="flex flex-col leading-none">
                <span className="font-logo text-3xl text-orange-600 -mb-1">Mystère</span>
                <span className="font-heading text-sm text-gray-700 tracking-wider">MEAL</span>
            </div>
        </div>
    );
};
