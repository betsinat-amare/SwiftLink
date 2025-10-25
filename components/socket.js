import { io } from 'socket.io-client';

const SOCKET_URL = 'https://herbackend-4.onrender.com';
const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
