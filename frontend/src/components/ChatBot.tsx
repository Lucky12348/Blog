import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import AddPost from './AddPost'

function Chatbot() {
	const [messages, setMessages] = useState([])
	const [inputMessage, setInputMessage] = useState('')
	const [isChatVisible, setIsChatVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const toggleChatVisibility = () => {
		setIsChatVisible(!isChatVisible)
	}

	const sendMessageMutation = useMutation(
		async message => {
			setIsLoading(true)
			const response = await fetch('http://localhost:8000/openai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({ prompt: message })
			})

			if (!response.ok) {
				throw new Error("Erreur lors de la communication avec l'assistant AI")
			}

			return response.json()
		},
		{
			onSuccess: data => {
				// Mettre à jour les messages avec la réponse de l'AI
				setMessages(currentMessages => [
					...currentMessages,
					{ sender: 'ai', content: data }
				])
				setIsLoading(false)
			}
		}
	)

	const sendMessage = () => {
		if (!inputMessage) return

		const newMessages = [...messages, { sender: 'user', content: inputMessage }]
		setMessages(newMessages)

		// Ajouter un message temporaire pendant le chargement
		if (sendMessageMutation.isLoading) {
			setMessages([...newMessages, { sender: 'ai', content: '...' }])
		}

		sendMessageMutation.mutate(inputMessage)
		setInputMessage('')
	}
	if (isLoading && !messages.some(message => message.content === '...')) {
		setMessages([...messages, { sender: 'ai', content: '...' }])
	}

	return (
		<>
			<button
				onClick={toggleChatVisibility}
				className='fixed bottom-4 right-4 m-0 inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-black bg-none p-0 text-sm font-medium normal-case leading-5 hover:bg-gray-700 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50'
				type='button'
				aria-haspopup='dialog'
				aria-expanded={isChatVisible}
				data-state={isChatVisible ? 'open' : 'closed'}
			>
				<svg
					xmlns=' http://www.w3.org/2000/svg'
					width='30'
					height='40'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='block border-gray-200 align-middle text-white'
				>
					<path
						d='m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z'
						className='border-gray-200'
					/>
				</svg>
			</button>

			{isChatVisible ? (
				<div
					className='fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 h-[634px] w-[440px] rounded-lg border border-[#e5e7eb] bg-white p-6'
					style={{
						boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)'
					}}
				>
					{/* Contenu de la fenêtre de chat */}
					{/* Heading */}
					<div className='flex flex-col space-y-1.5 pb-6 '>
						<h2 className='text-lg font-semibold tracking-tight'>
							Super Chatbot
						</h2>
						<p className='text-sm leading-3 text-[#6b7280]'>By GPT Turbo</p>
					</div>
					<div className='h-[474px] overflow-auto pr-4'>
						{/* Affichage des messages */}
						{messages.map((message, index) => (
							<div
								key={index}
								className={`my-4 flex flex-1 gap-3 text-sm text-gray-600 ${
									message.sender === 'ai' ? 'justify-start' : 'justify-end'
								}`}
							>
								<span className='relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full'>
									{/* Icône différente selon l'expéditeur */}
									<div className='rounded-full border bg-gray-100 p-1'>
										{message.sender === 'ai' ? (
											// Icône pour l'AI
											<svg
												stroke='none'
												fill='black'
												strokeWidth='1.5'
												viewBox='0 0 24 24'
												aria-hidden='true'
												height={20}
												width={20}
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z'
												/>
											</svg>
										) : (
											// Icône pour l'utilisateur
											<svg
												stroke='none'
												fill='black'
												strokeWidth={0}
												viewBox='0 0 16 16'
												height={20}
												width={20}
												xmlns='http://www.w3.org/2000/svg'
											>
												<path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z' />
											</svg>
										)}
									</div>
								</span>
								<p className='leading-relaxed'>
									<span className='block font-bold text-gray-700'>
										{message.sender === 'ai' ? 'AI' : 'You'}
									</span>
									{message.content}
								</p>
							</div>
						))}
					</div>

					{/* Zone de saisie */}
					<div className='flex items-center pt-0'>
						<form
							className='flex w-full items-center justify-center space-x-2'
							onSubmit={e => {
								e.preventDefault()
								sendMessage()
							}}
						>
							<input
								className='flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm text-[#030712] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
								placeholder='Type your message'
								value={inputMessage}
								onChange={e => setInputMessage(e.target.value)}
							/>
							<button
								type='submit'
								className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-[#f9fafb] hover:bg-[#111827E6] disabled:pointer-events-none disabled:opacity-50'
							>
								Send
							</button>
						</form>
					</div>
				</div>
			) : null}
			<AddPost />
		</>
	)
}

export default Chatbot
