const { lineHeight } = require("tailwindcss/defaultTheme");

module.exports = {
	content: (process.env.NODE_ENV == "production") ? [
		"./_src/templates/*.html"
	] : [
		"./_src/templates/*.html"
	],
	theme: {
		screens: {
			"xs": "480px",
			"sm": "640px",
			"md": "768px",
			"dk": "769px",
			"lg": "1024px",
			"xl": "1280px",
			"2xl": "1440px",
			"3xl": "1680px",
			"4xl": "1920px"
		},
		fontFamily: {
			"body": [
				"Helvetica Neue",
				"Helvetica",
				"Arial",
				"sans-serif"
			],
			"display": [
				"Times New Roman",
				"Times",
				"serif"
			]
		},
		letterSpacing: {
			"tighter": "-2px",
			"tight": "-1px",
			"normal": "0",
			"wide": "1px",
			"wider": "2px"
		},
		extend: {
			fontSize: {
				h1m: [
					"3rem",
					{
						lineHeight: "3.25rem",
						letterSpacing: "0.01em"
					}
				],
				h2m: [
					"2.5rem",
					{
						lineHeight: "2.75rem",
						letterSpacing: "0.01em"
					}
				],
				h3m: [
					"2.25rem",
					{
						lineHeight: "2.5rem",
						letterSpacing: "0.01em"
					}
				],
				h4m: [
					"2rem",
					{
						lineHeight: "2.25rem",
						letterSpacing: "0.01em"
					}
				],
				h5m: [
					"1.75rem",
					{
						lineHeight: "2rem",
						letterSpacing: "0.01em"
					}
				],
				h6m: [
					"1.5rem",
					{
						lineHeight: "1.75rem",
						letterSpacing: "0.01em"
					}
				],
				h1d: [
					"5.5rem",
					{
						lineHeight: "5.625rem",
						letterSpacing: "0.01em"
					}
				],
				h2d: [
					"3.75rem",
					{
						lineHeight: "3.875rem",
						letterSpacing: "0.01em"
					}
				],
				h3d: [
					"3rem",
					{
						lineHeight: "3.125rem",
						letterSpacing: "0.01em"
					}
				],
				h4d: [
					"2.5rem",
					{
						lineHeight: "2.625rem",
						letterSpacing: "0.01em"
					}
				],
				h5d: [
					"2.25rem",
					{
						lineHeight: "2.375rem",
						letterSpacing: "0.01em"
					}
				],
				h6d: [
					"2rem",
					{
						lineHeight: "2.125rem",
						letterSpacing: "0.01em"
					}
				],
				x50: [
					"50%",
					{
						lineHeight: "50%" 
					}
				],
				x60: [
					"60%",
					{
						lineHeight: "60%"
					}
				],
				x70: [
					"70%",
					{
						lineHeight: "70%"
					}
				],
				x80: [
					"80%",
					{
						lineHeight: "80%"
					}
				],
				x90: [
					"90%",
					{
						lineHeight: "90%"
					}
				],
				x100: [
					"100%",
					{
						lineHeight: "100%"
					}
				],
				x110: [
					"110%",
					{
						lineHeight: "110%"
					}
				],
				x120: [
					"120%",
					{
						lineHeight: "120%"
					}
				],
				x130: [
					"130%",
					{
						lineHeight: "130%"
					}
				],
				x140: [
					"140%",
					{
						lineHeight: "140%"
					}
				],
				x150: [
					"150%",
					{
						lineHeight: "150%"
					}
				]
			},
			spacing: {
				"xs": "1rem",
				"sm": "2rem",
				"md": "2rem",
				"dk": "4rem",
				"lg": "4rem",
				"xl": "4rem",
				"2xl": "4rem",
				"3xl": "8rem",
				"4xl": "8rem"
			},
			width: {
				x10: "10%",
				x20: "20%",
				x30: "30%",
				x40: "40%",
				x50: "50%",
				x60: "60%",
				x70: "70%",
				x80: "80%",
				x90: "90%",
				x100: "100%"
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp")
	]
}
