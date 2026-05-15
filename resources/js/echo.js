import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Luôn dùng window.location.hostname để tránh bị bake cứng 'localhost'
// vào bundle lúc Docker build. Nginx sẽ proxy /app/* sang Reverb:8080.
const wsHost = window.location.hostname;
const isHttps = window.location.protocol === 'https:';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: wsHost,
    wsPort: isHttps ? 443 : 80,
    wssPort: 443,
    forceTLS: isHttps,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
});
