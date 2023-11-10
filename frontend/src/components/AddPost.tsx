import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

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

function AddPost(): JSX.Element {
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

	return (
		<div className='bg-gray-500'>
			<h2>Ajouter un nouveau post</h2>
			<form onSubmit={onHandlePosts}>
				<div>
					<label
						htmlFor='title'
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
					>
						Titre:
					</label>
					<input
						type='text'
						id='title'
						className='sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-100 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						ref={titleInputReference}
						required
					/>
				</div>
				<div>
					<label
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
						htmlFor='description'
					>
						Description:
					</label>
					<textarea
						id='description'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						ref={descriptionInputReference}
						required
					/>
				</div>
				<div>
					<label
						className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
						htmlFor='file'
					>
						Image:
					</label>
					<input
						className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
						type='file'
						id='image'
						ref={imageFileInputReference}
					/>
				</div>
				<button type='submit'>Ajouter</button>
			</form>
			{signupMutation.isLoading ? <p>Chargement...</p> : undefined}
			{signupMutation.isError ? (
				<p>Erreur: {(signupMutation.error as Error).message}</p>
			) : undefined}
			{signupMutation.isSuccess ? (
				<p>Le post a été créé avec succès !</p>
			) : undefined}
		</div>
	)
}

export default AddPost
