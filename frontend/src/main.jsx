import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'

const isDev = true

ReactDOM.createRoot(document.getElementById('root')).render(
	<>
		{!isDev ? (
			<App />
		) : (
			<React.StrictMode>
				<App />
			</React.StrictMode>
		)}
	</>
)
