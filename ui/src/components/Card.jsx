import React from 'react';
import Voter from './Voter.jsx';
import './Card.css';

const Card = ({ id, content, author_id, vote, created_at }) => (
	<div id={id} className="link-card">
		<a href={id ? `/messages/${id}` : "#"}>
			<p>
				{content}
			</p>
			<span className="date-container">{new Date(created_at).toLocaleString()}</span>
		</a>
		<div className="vote-container">
			<Voter vote={vote} messageId={id} />
		</div>
	</div>
)
export default Card;
