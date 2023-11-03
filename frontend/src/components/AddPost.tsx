import React, { useState } from 'react'
import useUserInfo from '../hooks/VerifToken'

function AddPost() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState(null)

	const userInfo = useUserInfo()
	if (!userInfo) return null // ou afficher un loader, etc.

	const handleSubmit = e => {
		e.preventDefault()

		const url = new URL('http://localhost:8000/addPost')
		url.searchParams.append('user_id', userInfo._id)
		url.searchParams.append('title', title)
		url.searchParams.append('description', description)

		let fetchOptions = {
			method: 'POST'
		}

		if (image) {
			const formData = new FormData()
			formData.append('image', image)
			fetchOptions.body = formData
		}

		fetch(url, fetchOptions)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				// Reset form or navigate to another page, etc.
			})
			.catch(error => console.error(error))
	}

	return (
		<div>
			<h2>Ajouter un nouveau post</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Titre:</label>
					<input
						type='text'
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Description:</label>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						required
					></textarea>
				</div>
				<div>
					<label>Image:</label>
					<input type='file' onChange={e => setImage(e.target.files[0])} />
				</div>
				<button type='submit'>Ajouter</button>
			</form>
		</div>
	)
}

export default AddPost
