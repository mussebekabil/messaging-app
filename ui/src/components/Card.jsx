import React from 'react';
import Voter from './Voter.jsx';
import './Card.css';

const Card = ({ id, content, message_id, vote, created_at }) => {
	const isReplyCard = !!message_id;
	console.log(content)
	return (
		<div id={id} className="link-card">
			<a href={id && !isReplyCard ? `/messages/${id}` : "#"}>
				<p>
					{content}
				</p>
				<span className="date-container">{new Date(created_at).toLocaleString()}</span>
			</a>
			<div className="vote-container">
				{isReplyCard 
					? <Voter vote={vote} messageId={message_id} replyId={id} />
					: <Voter vote={vote} messageId={id} />
				}
			</div>
		</div>
	)
}
export default Card;
