const defaultConfig = require('tailwindcss/defaultConfig')
const formsPlugin = require('@tailwindcss/forms')

/** @type {import('tailwindcss/types').Config} */
const config = {
	content: ['index.html', 'src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultConfig.theme.fontFamily.sans]
			},
			colors: {
				'custom-blue': '#243c5a' // votre nouvelle couleur personnalisée
			},
			screens: {
				'3xl': '1600px' // votre nouveau point d'arrêt personnalisé
			}
		}
	},
	experimental: { optimizeUniversalDefaults: true },
	plugins: [formsPlugin]
}

module.exports = config
