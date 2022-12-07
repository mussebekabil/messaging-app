import React, { useEffect,useState } from 'react';
import { openWsConnection, closeWsConnection } from '../utils/wsUtil.js'
import Card from './Card.jsx';
import * as constants from '../utils/constants.js';

const SingleMessage = ({messageId, children}) => {
	const [replies, setReplies] = useState(null);
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
		async function fetchReplies () {
			const response = await fetch(`/api/replies/${messageId}`);
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
			{children}
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
