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
			<div className='mx-auto max-w-2xl rounded-md bg-white px-6 py-10'>
				<h1 className='mb-10 text-center text-2xl font-bold text-gray-500'>
					ADD POST
				</h1>
				<form onSubmit={onHandlePosts} className='space-y-4'>
					<div>
						<label htmlFor='title' className='text-lx font-serif'>
							Title:
						</label>
						<input
							type='text'
							placeholder='title'
							id='title'
							className='text-md ml-2 rounded-md border-2 px-2 py-1 outline-none'
							ref={titleInputReference}
							required
						/>
					</div>
					<div>
						<label
							htmlFor='description'
							className='mb-2 block font-serif text-lg'
						>
							Description:
						</label>
						<textarea
							id='description'
							cols={30}
							rows={10}
							placeholder='write here..'
							className='w-full rounded-md bg-indigo-50 p-4 font-serif text-gray-600 outline-none'
							ref={descriptionInputReference}
							required
						/>
					</div>
					<div>
						<label
							className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
							htmlFor='file_input'
						>
							Upload file
						</label>
						<input
							className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
							id='file_input'
							type='file'
							ref={imageFileInputReference}
						/>
					</div>
					<button className='mx-auto block rounded-md bg-indigo-600 px-6 py-2 text-lg font-semibold text-indigo-100'>
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
