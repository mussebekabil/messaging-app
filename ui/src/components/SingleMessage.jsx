import React, { useEffect,useState } from 'react';
import { openWsConnection, closeWsConnection } from '../utils/wsUtil.js';
import MessageForm from './MessageForm.jsx';
import Card from './Card.jsx';
import * as constants from '../utils/constants.js';

const SingleMessage = ({ message }) => {
	const [replies, setReplies] = useState([]);
	const [safeMessage, setSafeMessage] = useState({});

	const handleMessage = (messageEvent) => {
		const data = JSON.parse(messageEvent.data)
			switch (data.type) {
				case constants.REPLY_VOTE_TYPE:
					const updatedReplies = replies.map(r => r.id == data.replyId ? {...r, vote: data.vote} : r)
					setReplies(updatedReplies)
					break;
				case constants.REPLY_TYPE:
					setReplies([
						data,
						...replies
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
	}, [replies])

	useEffect(() => {
		setSafeMessage(message)
	}, [message])
	
	useEffect(() => {
		async function fetchReplies () {
			const response = await fetch(`/api/replies/${safeMessage.id}`);
			const { replies } = await response.json();
			setReplies(replies)
		}
		fetchReplies()
		
		return () => {
			console.log('unmounted')
			closeWsConnection()
		}
	}, [])
	
	return (
    <div>
			<Card {...safeMessage} />
			<div className="message-card">
				<MessageForm placeholder="Reply your thoughts" messageId={safeMessage.id}/>
			</div>
			<ul role="list" className="link-card-grid">
				{replies?.map((reply) => (
					<li key={reply.id}>
						<Card {...reply} />
					</li>
				))}
			</ul>
		</div>		
	)
};
export default SingleMessage;
