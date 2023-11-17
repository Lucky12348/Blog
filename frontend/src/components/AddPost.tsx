import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

interface UserData {
	title: string
	description: string
	image?: string
}

const createPost = async (userData: UserData): Promise<JSON> => {
	const token = localStorage.getItem('token')
	const response = await fetch('http://localhost:8000/posts/', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})

	if (!response.ok) {
		throw new Error('Erreur lors de la création du post')
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return response.json()
}

function AddPost({ postDetails }): JSX.Element {
	const titleInputReference = useRef<HTMLInputElement>(null)
	const descriptionInputReference = useRef<HTMLTextAreaElement>(null)
	const imageFileInputReference = useRef<HTMLInputElement>(null)
	const signupMutation = useMutation(createPost)

	const onHandlePosts = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		const postData = {
			title: titleInputReference.current?.value as string,
			description: descriptionInputReference.current?.value as string
		}
		const file = imageFileInputReference.current?.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.addEventListener('load', () => {
				// Maintenant, vous pouvez muter avec la mutation de création de post
				signupMutation.mutate({
					...postData,
					image: reader.result as string
				})
			})
			reader.addEventListener('error', () => {
				console.error('Erreur lors de la lecture du fichier')
			})
		} else {
			// Si aucune image n'est fournie, envoyez les autres données
			signupMutation.mutate(postData)
		}
	}
	useEffect(() => {
		if (postDetails) {
			if (titleInputReference.current && postDetails.title) {
				titleInputReference.current.value = postDetails.title
			}
			if (descriptionInputReference.current && postDetails.description) {
				descriptionInputReference.current.value = postDetails.description
			}
		}
	}, [postDetails])

	return (
		<div className='min-h-screen bg-indigo-50 pt-6 md:px-20'>
			<div className='mx-auto max-w-2xl rounded-md bg-white px-6 py-10 shadow-lg'>
				<h1 className='mb-10 text-center text-3xl font-bold text-gray-700'>
					ADD POST
				</h1>
				<form onSubmit={onHandlePosts} className='space-y-6'>
					<div>
						<label htmlFor='title' className='font-serif text-lg'>
							Title:
						</label>
						<input
							type='text'
							placeholder='Enter title here'
							id='title'
							className='text-md mt-1 w-full rounded-md border-2 px-4 py-2 outline-none transition duration-200 ease-in-out focus:border-indigo-300'
							ref={titleInputReference}
							required
						/>
					</div>
					<div>
						<label htmlFor='description' className='block font-serif text-lg'>
							Description:
						</label>
						<textarea
							id='description'
							cols={30}
							rows={10}
							placeholder='Write your post content here...'
							className='w-full rounded-md bg-indigo-100 p-4 font-serif text-gray-700 outline-none transition duration-200 ease-in-out focus:bg-white'
							ref={descriptionInputReference}
							required
						/>
					</div>
					<div>
						<label
							htmlFor='file_input'
							className='block text-sm font-medium text-gray-900'
						>
							Upload file
						</label>
						<input
							className='block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-100 file:bg-gray-50 file:px-4 file:py-3 hover:border-indigo-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500
    disabled:pointer-events-none disabled:opacity-50
     dark:focus:ring-gray-600'
							id='file_input'
							type='file'
							ref={imageFileInputReference}
						/>
					</div>
					<button className='mx-auto block rounded-md bg-indigo-700 px-6 py-2 text-lg font-semibold text-white transition duration-200 ease-in-out hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50'>
						ADD POST
					</button>
				</form>
				{signupMutation.isLoading ? <p>Chargement...</p> : undefined}
				{signupMutation.isError ? (
					<p>Erreur: {(signupMutation.error as Error).message}</p>
				) : undefined}
				{signupMutation.isSuccess ? (
					<p>Le post a été créé avec succès !</p>
				) : undefined}
			</div>
		</div>
	)
}

export default AddPost
