import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'

const isProduction = true

ReactDOM.createRoot(document.getElementById('root')).render(
	<>
		{isProduction ? (
			<App />
		) : (
			<React.StrictMode>
				<App />
			</React.StrictMode>
		)}
	</>
)
