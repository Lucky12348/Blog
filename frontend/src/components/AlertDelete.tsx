/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ChildrenProperties {
	idPost: string
}

export function AlertDelete({ idPost }: ChildrenProperties): JSX.Element {
	const [message, setMessage] = useState('')
	const navigate = useNavigate()

	const deleteMutation = useMutation(
		async () => {
			const response = await fetch(`http://localhost:8000/posts/${idPost}`, {
				method: 'DELETE'
			})

			if (!response.ok) {
				throw new Error('Problème lors de la suppression du post')
			}

			return response.json()
		},
		{
			onSuccess: () => {
				setMessage('Post supprimé avec succès. Redirection...')
				setTimeout(() => navigate('/'), 2000)
			},
			onError: () => {
				setMessage('Erreur lors de la suppression du post')
			}
		}
	)

	const onHandleDelete = (): void => {
		deleteMutation.mutate()
	}

	return (
		<div className='mb-4'>
			<p>Êtes-vous sûr de vouloir supprimer ce post ?</p>
			<h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-2xl'>
				Êtes-vous sûr de vouloir{' '}
				<span className='text-red-600 dark:text-red-500'>
					vouloir supprimer ce post ?
				</span>
			</h1>
			<button
				type='button'
				onClick={onHandleDelete}
				className='inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='mr-2 h-5 w-5'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
					/>
				</svg>
				Oui je suis sûr !
			</button>

			{message ? (
				<div>
					<p className='text-green-500'>{message}</p>
					<div className='text-center'>
						<div role='status'>
							<svg
								aria-hidden='true'
								className='inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
								viewBox='0 0 100 101'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
									fill='currentColor'
								/>
								<path
									d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
									fill='currentFill'
								/>
							</svg>
							<span className='sr-only'>Loading...</span>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default AlertDelete
