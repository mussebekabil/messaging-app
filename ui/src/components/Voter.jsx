import React from 'react';
import './Voter.css'; 

const  Voter = ({ messageId, replyId, vote}) => {
	const updateVote = async (updatedVote) => {
		const url = !!replyId ? `/api/replies/${replyId}` : `/api/messages/${messageId}`;
		try {
			await fetch(url, {
				method: "PATCH",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify({ vote: updatedVote })
			});
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<div className="vote">
				<span onClick={() => updateVote(vote + 1)} className="arrow text-gradient">&#8896;</span>
				<pre>{vote}</pre>
				<span onClick={() => updateVote(vote - 1)} className="arrow text-gradient"> &#8897;</span>
			</div>
		</>
	);
}

export default Voter
