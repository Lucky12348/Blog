import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useState } from 'react'
import type { ContentEditableEvent } from 'react-simple-wysiwyg'
import Editor from 'react-simple-wysiwyg'
import logoDefault from '../../public/images/defaultPost.png'
import DefaultAlertDelete from '../components/AlertDelete'
import Modal from '../components/Modal'

const queryParameters = new URLSearchParams(window.location.search)
const postId = queryParameters.get('idPost')

export interface Post {
	_id: string
	title: string
	description: string
	image: string
	date: string
	auteur?: string
}

const fetchPost = async (): Promise<Post> => {
	if (!postId) throw new Error('Post ID is required.')
	const response = await fetch(`http://localhost:8000/posts/${postId}`)
	if (!response.ok) {
		throw new Error('Network response was not ok')
	}
	return (await response.json()) as Post
}

const updatePostData = async (updateData: {
	title?: string
	description?: string
}): Promise<Post> => {
	const response = await fetch(`http://localhost:8000/posts/${postId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updateData)
	})

	if (!response.ok) {
		throw new Error('Network response was not ok')
	}

	return (await response.json()) as Post
}

export default function Front(): React.ReactElement {
	const queryClient = useQueryClient()
	const {
		data: post,
		error,
		isError,
		isLoading
	} = useQuery(['post', postId], fetchPost)

	const [isModalOpen, setIsModalOpen] = useState(false)

	const [html, setHtml] = useState('')
	const [title, setTitle] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const [isTitleEditing, setIsTitleEditing] = useState(false)

	const { mutate: updatePost } = useMutation(updatePostData, {
		onSuccess: () => {
			void queryClient.invalidateQueries(['post', postId])
			setIsEditing(false)
			setIsTitleEditing(false)
		}
	})

	const onHandleTitleChange = (
		event_: React.ChangeEvent<HTMLInputElement>
	): void => {
		setTitle(event_.target.value)
	}

	const onHandleDescriptionChange = (event_: ContentEditableEvent): void => {
		setHtml(event_.target.value)
	}

	const onHandleSaveClick = (): void => {
		updatePost({ title, description: html })
	}

	const onHandleTitleKeyDown = (event_: React.KeyboardEvent): void => {
		if (event_.key === 'Enter') {
			updatePost({ title })
			event_.preventDefault()
		} else if (event_.key === 'Escape') {
			setIsTitleEditing(false)
		}
	}

	const onHandleEditClick = (): void => {
		setIsEditing(!isEditing)
		setIsTitleEditing(false)
		setTitle(post?.title ?? '')
		setHtml(post?.description ?? '')
	}

	const onHandleTitleDoubleClick = (): void => {
		setIsTitleEditing(true)
		setIsEditing(true)
	}

	const onHandleKeyDown = (
		event_: React.KeyboardEvent<HTMLButtonElement>
	): void => {
		if (event_.ctrlKey && event_.key === 's') {
			updatePost({ description: html })
			event_.preventDefault()
		} else if (event_.key === 'Escape') {
			setIsEditing(false)
		}
	}
	const onHandleModalOpen = (): void => {
		setIsModalOpen(true)
	}
	const onHandleModalClose = (): void => {
		setIsModalOpen(false)
	}

	if (isLoading) {
		return <p>Loading...</p>
	}

	if (isError) {
		let errorMessage = 'An error occurred'
		if (typeof error === 'object' && error !== null && 'message' in error) {
			errorMessage = error.message as string
		}
		return <p>Error: {errorMessage}</p>
	}

	return (
		<div className='mx-auto max-w-screen-xl'>
			<main className='mt-10'>
				<div className='flex items-center'>
					<button
						type='button'
						onClick={onHandleEditClick}
						className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800'
					>
						{isEditing || isTitleEditing ? 'Annuler' : 'Éditer'}
					</button>
					{isEditing ? (
						<button
							type='button'
							onClick={onHandleSaveClick}
							className='mb-2 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800'
						>
							Enregistrer
						</button>
					) : (
						<button
							type='button'
							onClick={onHandleModalOpen}
							className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800'
						>
							Supprimer
						</button>
					)}
				</div>
				<Modal isOpen={isModalOpen} onClose={onHandleModalClose}>
					<DefaultAlertDelete idPost={postId ?? ''} />
				</Modal>

				<div
					className='relative mx-auto mb-4 w-full max-w-screen-md md:mb-0'
					style={{ height: '24em' }}
				>
					<div
						className='absolute bottom-0 left-0 z-10 h-full w-full'
						style={{
							backgroundImage:
								'linear-gradient(180deg,transparent,rgba(0,0,0,.7))'
						}}
					/>
					<img
						src={post.image || logoDefault}
						alt={post.image ? "Image de l'article" : 'Logo par défaut'}
						className='absolute left-0 top-0 z-0 h-full w-full object-cover'
					/>
					<div className='absolute bottom-0 left-0 z-20 p-4'>
						<h2 className='text-4xl font-semibold leading-tight text-gray-100'>
							{isTitleEditing ? (
								<input
									type='text'
									value={title}
									onChange={onHandleTitleChange}
									onKeyDown={onHandleTitleKeyDown}
									className='border-0 bg-transparent text-4xl font-semibold leading-tight text-gray-100'
								/>
							) : (
								<span
									className='cursor-pointer text-4xl font-semibold leading-tight text-gray-100'
									onDoubleClick={onHandleTitleDoubleClick}
								>
									{post.title}
								</span>
							)}
						</h2>
						<div className='mt-3 flex'>
							<div>
								<p className='text-sm font-semibold text-gray-200'>
									{post.auteur ?? 'anonymous'}
								</p>{' '}
								<p className='text-xs font-semibold text-gray-400'>
									{' '}
									{post.date}{' '}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Supprimer button and other content... */}
				<div className='mx-auto mt-12 max-w-screen-md px-4 text-lg leading-relaxed text-gray-700 lg:px-0'>
					{isEditing ? (
						<Editor
							value={html}
							onChange={onHandleDescriptionChange}
							onKeyDown={onHandleKeyDown}
						/>
					) : (
						<button
							type='button'
							onDoubleClick={onHandleEditClick}
							onKeyDown={onHandleKeyDown}
						>
							{post.description || ''}
						</button>
					)}
				</div>
			</main>
		</div>
	)
}
