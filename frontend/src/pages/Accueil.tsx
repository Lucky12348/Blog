import { useMutation } from '@tanstack/react-query'
import React, { FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../public/css/styles.css'

interface UserData {
	name?: string
	email: string
	password: string
}

const signup = async userData => {
	const response = await fetch('http://localhost:8000/signup/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})

	if (!response.ok) {
		throw new Error('Erreur lors de la création du compte')
	}

	return response.json()
}

const login = async (userData: UserData): Promise<Record<string, unknown>> => {
	const response = await fetch('http://localhost:8000/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})

	if (!response.ok) {
		throw new Error('Erreur lors de la connexion')
	}

	return response.json()
}

export function Accueil() {
	const signupMutation = useMutation(signup)
	const loginMutation = useMutation(login)
	const navigate = useNavigate()

	const handleSignupSubmit = event => {
		event.preventDefault()
		const userData = {
			name: event.target.logname.value,
			email: event.target.logemail.value,
			password: event.target.logpass.value
		}
		signupMutation.mutate(userData)
	}

	const handleLoginSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		const target = event.target as typeof event.target & {
			logemail: { value: string }
			logpass: { value: string }
		}
		const userData: UserData = {
			email: target.logemail.value,
			password: target.logpass.value
		}
		loginMutation.mutate(userData)
	}

	useEffect(() => {
		if (signupMutation.isSuccess || loginMutation.isSuccess) {
			navigate('/blog')
			localStorage.setItem(
				'token',
				String(
					signupMutation.data?.access_token || loginMutation.data?.access_token
				)
			)
		}
	}, [signupMutation.isSuccess, loginMutation.isSuccess, navigate])

	return (
		<div className='bodyForm'>
			<div className='sectionForm'>
				<div className='container'>
					<div className='row full-height justify-content-center'>
						<div className='col-12 align-self-center py-5 text-center'>
							<div className='section pt-sm-2 pb-5 pt-5 text-center'>
								<h6 className='mb-0 pb-3'>
									<span>Log In </span>
									<span>Sign Up</span>
								</h6>

								<input
									className='checkbox'
									type='checkbox'
									id='reg-log'
									name='reg-log'
								/>
								<label htmlFor='reg-log'></label>
								<div className='card-3d-wrap mx-auto'>
									<div className='card-3d-wrapper'>
										<div className='card-front'>
											<div className='center-wrap'>
												<div className='section text-center'>
													<h4 className='mb-4 pb-3'>Log In</h4>
													<form onSubmit={handleLoginSubmit}>
														<div className='htmlForm-group'>
															<input
																type='email'
																name='logemail'
																className='htmlForm-style'
																placeholder='Email'
																id='logemail'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-at'></i>
														</div>
														<div className='htmlForm-group mt-2'>
															<input
																type='password'
																name='logpass'
																className='htmlForm-style'
																placeholder='Mot de passe'
																id='logpass'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-lock-alt'></i>
														</div>
														<button type='submit' className='btn mt-4'>
															Connexion
														</button>
													</form>
												</div>
											</div>
										</div>
										<div className='card-back'>
											<div className='center-wrap'>
												<div className='section text-center'>
													<h4 className='mb-4 pb-3'>Sign Up</h4>
													<form onSubmit={handleSignupSubmit}>
														<div className='htmlForm-group'>
															<input
																type='text'
																name='logname'
																className='htmlForm-style'
																placeholder='Pseudo'
																id='logname'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-user'></i>
														</div>
														<div className='htmlForm-group mt-2'>
															<input
																type='email'
																name='logemail'
																className='htmlForm-style'
																placeholder='Email'
																id='logemail'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-at'></i>
														</div>
														<div className='htmlForm-group mt-2'>
															<input
																type='password'
																name='logpass'
																className='htmlForm-style'
																placeholder='Mot de passe'
																id='logpass'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-lock-alt'></i>
														</div>
														<button type='submit' className='btn mt-4'>
															Inscription
														</button>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{signupMutation.isLoading && <p>Chargement...</p>}
			{signupMutation.isError && (
				<p>Erreur: {(signupMutation.error as Error).message}</p>
			)}
			{loginMutation.isLoading && <p>Chargement...</p>}
			{loginMutation.isError && (
				<p>Erreur: {(loginMutation.error as Error).message}</p>
			)}
		</div>
	)
}

export default Accueil
