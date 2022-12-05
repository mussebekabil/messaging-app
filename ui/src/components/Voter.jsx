import { useState } from 'react';
import './Voter.css'; 

const  Voter = ({ messageId, vote: initialVote}) => {
	console.log('vote', parseInt(initialVote))
	const [vote, setVote] = useState(initialVote);
	
	const updateVote = async (updatedVote) => {
		try {
			await fetch(`/api/messages/${messageId}`, {
				method: "PATCH",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify({ vote: updatedVote })
			});
		} catch (error) {
			console.log(error)
		}
	}
	
	const add = async () => {
		const updatedVote = vote + 1;
		await updateVote(updatedVote)
		setVote(updatedVote)
	};

	const subtract = async () => {
			const updatedVote = vote - 1;
			await updateVote(updatedVote)
			setVote(updatedVote)
	}

	return (
		<>
			<div className="vote">
				<span onClick={add} className="arrow text-gradient">&#8896;</span>
				<pre>{vote}</pre>
				<span onClick={subtract} className="arrow text-gradient"> &#8897;</span>
			</div>
		</>
	);
}

export default Voter
