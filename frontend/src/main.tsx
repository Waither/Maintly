import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

// Font Awesome (najpierw)
import '@fortawesome/fontawesome-free/css/all.min.css';

// MDBootstrap Pro styles (z lokalnego pakietu)
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

// Twoje custom styles NA KOŃCU (nadpisują MDB jeśli potrzeba)
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// Rejestracja Service Worker dla PWA
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js')
		.then((registration) => {
			console.log('SW registered: ', registration);
		})
		.catch((registrationError) => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}
