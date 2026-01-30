/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0F172A',
                    accent1: '#2DD4BF', // Teal
                    accent2: '#F59E0B', // Amber
                    surface: '#1E293B',
                    light: '#F8FAFC',
                    muted: '#94A3B8'
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        }
    },
    safelist: [
        'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-4',
        'md:col-span-1', 'md:col-span-2',
        'row-span-1', 'row-span-2',
        'h-64', 'h-96', 'h-[32rem]'
    ],
    plugins: [],
}
