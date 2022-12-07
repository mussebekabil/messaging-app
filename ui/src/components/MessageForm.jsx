import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getUserId } from '../utils/localStorageUtil.js';

import 'react-toastify/dist/ReactToastify.css';
import './MessageForm.css';


const MessageForm = ({ messageId, placeholder }) => {
	const [content, setContent] = useState('');
	const [error, setError] = useState('');
	const isReplyForm = messageId; 
	
	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('');
		if(!content) {
			setError('Please write some content before posting.')
			return;
		}
		const url = isReplyForm ? '/api/replies' : '/api/messages';
		try {
			await fetch(url, {
				method: "POST",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify({ 
					content, 
					messageId,
					authorId: getUserId(),
				})
			});
		
			setContent('')
		} catch (error) {
			setError('Something went wrong.')
			console.log(error)
		}
	}

	if(error) {
		toast.error(error)
		setError('')
	}

	return (
		<div className="form-container">
			<form>
				<textarea 
					className="post-panel" 
					name="content"
					value={content} 
					onChange={(e) => {setContent(e.target.value)}} 
					placeholder={isReplyForm ? 'Reply for message' : 'Share your thoughts'}
				></textarea>
				<button className="button-primary" onClick={handleSubmit}> {isReplyForm ? 'Reply' : 'Post'} </button>
				{isReplyForm && <button className="button-secondary" 
					onClick={(e) => {
						e.preventDefault()
						window.location.assign('/');
						}} 
					> Go back </button>}
			</form>
			<ToastContainer />
		</div>
	);
}
export default MessageForm;
