import React, { useEffect,useState, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { openWsConnection, closeWsConnection } from '../utils/wsUtil.js'
import Card from './Card.jsx';
import MessageForm from './MessageForm.jsx';
import * as constants from '../utils/constants.js';
import useFetch from '../../hooks/useFetch.js';

import 'react-toastify/dist/ReactToastify.css';

const Messages = () => {
	const [offset, setOffset] = useState(0);
	const { 
		isLoading, 
		error, 
		items, 
		setItems, 
		hasMore 
	} = useFetch('/api/messages', offset);
	const observer = useRef();
	
	const lastMessageElementRef = useCallback((node) => {
		if (isLoading) return;
		if (observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				setOffset((prev) => prev + 20);
			}
		});
		if (node) observer.current.observe(node);
	}, [isLoading]);

	const handleMessage = (messageEvent) => {
		const data = JSON.parse(messageEvent.data)
			switch (data.type) {
				case constants.MESSAGE_VOTE_TYPE:
					const updatedMessages = items.map(m => m.id == data.messageId ? {...m, vote: data.vote} : m)
					setItems(updatedMessages)
					break;
				case constants.MESSAGE_TYPE:
					setItems([
						data,
						...items
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

		return () => {
			console.log('unmounted')
			closeWsConnection()
		}
	}, [items])

	if(error) toast(error.toString())
	
	return (
    <div>
			<div className="message-card">
				<MessageForm messageId="" placeholder="Share your thoughts" />
			</div>
			<ul role="list" className="link-card-grid">
				{items.map((message, index) => {
					if(items.length === index + 1) {
						return (
							<li key={message.id} ref={lastMessageElementRef} >
								<Card {...message} />
							</li>
						)
					}
					return (
						<li key={message.id} >
							<Card {...message} />
						</li>
					)
				})}
			</ul>
			<div>{isLoading && "Loading..."}</div>
			<ToastContainer />
		</div>		
	)
};
export default Messages;
