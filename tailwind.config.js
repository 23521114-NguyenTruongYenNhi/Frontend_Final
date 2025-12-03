/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Define custom font families
            fontFamily: {
                // Primary font: Set Poppins as the default for everything (Sans-serif)
                // This matches the "Find your interesting trip here" style
                sans: ['Poppins', 'sans-serif'],

                // Secondary font: Also mapped to Poppins to ensure consistency
                // (We removed Playfair Display as requested)
                serif: ['Poppins', 'sans-serif'],

                // Helper fonts (kept for specific buttons or logos if needed)
                rounded: ['Quicksand', 'sans-serif'],
                handwriting: ['Satisfy', 'cursive'],
            },
        },
    },
    plugins: [],
}