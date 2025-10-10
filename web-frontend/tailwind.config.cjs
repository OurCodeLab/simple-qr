/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}'
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'hd': {
					// Primary brand colors
					'black': '#000000',
					'white': '#ffffff',
					'brown': '#8b4513',
					// Complementary coffee/cafe palette
					'cream': '#f5f5dc',        // Light cream for backgrounds
					'espresso': '#3c2415',     // Dark brown for text
					'latte': '#d4a574',       // Medium brown for accents
					'mocha': '#6b4423',       // Rich brown for buttons
					'caramel': '#c87533',     // Warm accent
					// Accessibility-compliant grays
					'gray': {
						50: '#fafafa',
						100: '#f5f5f5', 
						200: '#e5e5e5',
						300: '#d4d4d4',
						400: '#a3a3a3',
						500: '#737373',
						600: '#525252',
						700: '#404040',
						800: '#262626',
						900: '#171717',
					},
					// Dark mode variants
					'dark': {
						'bg': '#0f0f0f',        // Almost black background
						'surface': '#1a1a1a',   // Card/surface color
						'border': '#333333',    // Border color
						'text': '#e5e5e5',     // Primary text
						'text-muted': '#a3a3a3', // Secondary text
						'brown': '#a0612d',     // Lighter brown for dark mode
					}
				},
				// Legacy colors (keeping for compatibility)
				'rsfc-500': '#0b5f74', 
				'rsfc-400': '#12808f',
				'rsfc-300': '#33a1b3',
				'rsfc-50': '#f3fbfb'
			},
			fontFamily: {
				'sans': ['Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			container: {
				center: true,
				padding: '1rem',
			},
			keyframes: {
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
			},
			borderRadius: {
				'none': '0',
			}
		}
	},
	plugins: [],
}
