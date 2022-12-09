import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { openWsConnection, closeWsConnection } from '../utils/wsUtil.js';
import MessageForm from './MessageForm.jsx';
import Card from './Card.jsx';
import * as constants from '../utils/constants.js';
import useFetch from '../hooks/useFetch.js';

import 'react-toastify/dist/ReactToastify.css';

const SingleMessage = ({ message }) => {
	const [safeMessage, setSafeMessage] = useState({});
	const [offset, setOffset] = useState(0);
	const { 
		isLoading, 
		error, 
		items, 
		setItems, 
		hasMore 
	} = useFetch(`/api/replies/${message?.id}`, offset);
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
				case constants.REPLY_VOTE_TYPE:
					const updatedReplies = items.map(r => r.id == data.replyId ? {...r, vote: data.vote} : r)
					setItems(updatedReplies)
					break;
				case constants.REPLY_TYPE:
					setItems([
						data,
						...items
					])
					break;
				case constants.MESSAGE_VOTE_TYPE: 
					setSafeMessage({ ...safeMessage, vote: data.vote })
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

	useEffect(() => {
		setSafeMessage(message)
	})
	
	if(error) toast(error.toString())

	return (
    <div>
			<Card {...safeMessage} />
			<div className="message-card">
				<MessageForm placeholder="Reply your thoughts" messageId={safeMessage.id}/>
			</div>
			<ul role="list" className="link-card-grid">
				{items?.map((reply, index) => {
					if(items.length === index + 1) {
						return (
							<li key={reply.id} ref={lastMessageElementRef}>
								<Card {...reply} />
							</li>
						)
					} 
					return (
						<li key={reply.id}>
							<Card {...reply} />
						</li>
					)
				})}
			</ul>
			<div>{isLoading && "Loading..."}</div>
			<ToastContainer />
		</div>		
	)
};
export default SingleMessage;
