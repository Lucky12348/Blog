/* eslint-disable */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import Editor from 'react-simple-wysiwyg'
import logoDefault from '../../public/images/defaultPost.png'
import AlertSupprimer from '../components/AlertSupprimer'
import Modal from '../components/Modal'

const queryParameters = new URLSearchParams(window.location.search)
const postId = queryParameters.get('idPost')

export interface Post {
	_id: string
	title: string
	description: string
	image: string
	date: string
}

const fetchPost = async (): Promise<Post> => {
	if (!postId) throw new Error('Post ID is required.')
	const response = await fetch(`http://localhost:8000/posts/${postId}`)
	if (!response.ok) {
		throw new Error('Network response was not ok')
	}
	return response.json()
}

const updatePostData = async (updateData: {
	title?: string
	description?: string
}) => {
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

	return response.json()
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
			queryClient.invalidateQueries(['post', postId])
			setIsEditing(false)
			setIsTitleEditing(false)
		}
	})

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setHtml(e.target.value)
	}

	const handleSaveClick = () => {
		updatePost({ title, description: html })
	}

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			updatePost({ title })
			e.preventDefault()
		} else if (e.key === 'Escape') {
			setIsTitleEditing(false)
		}
	}

	const handleEditClick = () => {
		setIsEditing(!isEditing)
		setIsTitleEditing(false)
		setTitle(post?.title || '')
		setHtml(post?.description || '')
	}

	const handleTitleDoubleClick = () => {
		setIsTitleEditing(true)
		setIsEditing(true)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.ctrlKey && e.key === 's') {
			updatePost({ description: html })
			e.preventDefault()
		} else if (e.key === 'Escape') {
			setIsEditing(false)
		}
	}

	if (isLoading) {
		return <p>Loading...</p>
	}

	if (isError) {
		return <p>Error: {error.message}</p>
	}

	return (
		<div className='mx-auto max-w-screen-xl'>
			<main className='mt-10'>
				<div className='flex items-center'>
					<button
						type='button'
						onClick={handleEditClick}
						className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800'
					>
						{isEditing || isTitleEditing ? 'Annuler' : 'Éditer'}
					</button>
					{isEditing ? (
						<button
							type='button'
							onClick={handleSaveClick}
							className='mb-2 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800'
						>
							Enregistrer
						</button>
					) : (
						<button
							type='button'
							onClick={() => setIsModalOpen(true)}
							className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800'
						>
							Supprimer
						</button>
					)}
				</div>
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					children={<AlertSupprimer idPost={postId} />}
				/>

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
						src={post.image ? post.image : logoDefault}
						className='absolute left-0 top-0 z-0 h-full w-full object-cover'
					/>
					<div className='absolute bottom-0 left-0 z-20 p-4'>
						<h2 className='text-4xl font-semibold leading-tight text-gray-100'>
							{isTitleEditing ? (
								<input
									type='text'
									value={title}
									onChange={handleTitleChange}
									onKeyDown={handleTitleKeyDown}
									className='border-0 bg-transparent text-4xl font-semibold leading-tight text-gray-100'
									autoFocus
								/>
							) : (
								<span
									className='cursor-pointer text-4xl font-semibold leading-tight text-gray-100'
									onDoubleClick={handleTitleDoubleClick}
								>
									{post.title}
								</span>
							)}
						</h2>
						<div className='mt-3 flex'>
							<img
								src='https://randomuser.me/api/portraits/men/97.jpg'
								className='mr-2 h-10 w-10 rounded-full object-cover'
							/>
							<div>
								<p className='text-sm font-semibold text-gray-200'>
									{' '}
									Mike Sullivan{' '}
								</p>
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
							onChange={handleDescriptionChange}
							onKeyDown={handleKeyDown}
						/>
					) : (
						<div
							dangerouslySetInnerHTML={{ __html: post.description || '' }}
							onDoubleClick={handleEditClick}
							tabIndex={0} // Rend le div focusable
							onKeyDown={isEditing ? handleKeyDown : undefined}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
