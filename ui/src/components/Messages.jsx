import React, { useEffect,useState } from 'react';
import { openWsConnection, closeWsConnection } from '../utils/wsUtil.js'
import Card from './Card.jsx';
import MessageForm from './MessageForm.jsx';
import * as constants from '../utils/constants.js';

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const handleMessage = (messageEvent) => {
		const data = JSON.parse(messageEvent.data)
			switch (data.type) {
				case constants.MESSAGE_VOTE_TYPE:
					const updatedMessages = messages.map(m => m.id == data.messageId ? {...m, vote: data.vote} : m)
					setMessages(updatedMessages)
					break;
				case constants.MESSAGE_TYPE:
					setMessages([
						data,
						...messages
					])
					break;
				default:
					break;
			}
			console.log('ws data: ', data)
			return false;
	}

	useEffect(() => {
		openWsConnection(handleMessage);
	}, [messages])
	
	useEffect(() => {
		async function fetchMessages () {
			const response = await fetch('/api/messages');
			const { messages } = await response.json();
			setMessages(messages)
		}
		fetchMessages()

		return () => {
			console.log('unmounted')
			closeWsConnection()
		}
	}, [])

	return (
    <div>
			<div className="message-card">
				<MessageForm messageId="" placeholder="Share your thoughts" />
			</div>
			<ul role="list" className="link-card-grid">
				{messages.map((message) => (
					<li key={message.id}>
						<Card {...message} />
					</li>
				))}
			</ul>
		</div>		
	)
};
export default Messages;
