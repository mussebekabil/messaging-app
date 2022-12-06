import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getUserId } from '../utils/localStorageUtil.js';

import 'react-toastify/dist/ReactToastify.css';
import './MessageForm.css';

const MessageForm = ({ messageId, placeholder }) => {
	const [content, setContent] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('');
		if(!content) {
			setError('Please write some content before posting.')
			return;
		}

		try {
			await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify({ 
					content, 
					authorId: getUserId()
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
					placeholder={placeholder}
				></textarea>
				<button className="button-primary" onClick={handleSubmit}> Post </button>
				{/* <button className="button-secondary" 
					onClick={(e) => {
						e.preventDefault()
						window.location.assign('/');
						}} 
					> Close </button> */}
			</form>
			<ToastContainer />
		</div>
	);
}
export default MessageForm;
