import { getUserId } from './localStorageUtil.js';

let socket;

export const closeWsConnection = () => {
	if(socket) {
		socket.onclose = (code, reason) => console.log("WebSocket connection closed: ", code, reason);
	}
}

export const openWsConnection = (handleMessage) => {
	if(!socket) {
		socket = new WebSocket(`ws://localhost:7779/connect?${getUserId()}`);
	} 

	socket.onerror = (e) => console.error("WebSocket error:", e);
	socket.onmessage = handleMessage;
	socket.onopen = () => console.log("WebSocket connection created");
}
