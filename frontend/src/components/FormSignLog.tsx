/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import '../../public/css/styles.css'

interface UserData {
	name?: string
	email: string
	password: string
}

const signup = async (userData: UserData): Promise<Record<string, unknown>> => {
	const response = await fetch('http://localhost:8000/signup/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})

	if (!response.ok) {
		throw new Error("Erreur lors de l'inscription")
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return response.json()
}

export function Accueil(): JSX.Element {
	const loginMutation = useMutation(login, {
		onSuccess: data => {
			if (typeof data.access_token === 'string') {
				localStorage.setItem('token', data.access_token)
			} else {
				// handle the case where data.access_token is not a string
			}
			window.location.reload()
		}
	})

	const signupMutation = useMutation(signup, {
		onSuccess: data => {
			if (typeof data.access_token === 'string') {
				localStorage.setItem('token', data.access_token)
			}
			window.location.reload()
		}
	})
	const onHandleSignupSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		const target = event.target as HTMLFormElement
		const userData: UserData = {
			name: target.logname.value,
			email: target.logemail.value,
			password: target.logpass.value
		}
		signupMutation.mutate(userData)
	}

	const onHandleLoginSubmit = (event: FormEvent<HTMLFormElement>): void => {
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
								<label htmlFor='reg-log' />
								<div className='card-3d-wrap mx-auto'>
									<div className='card-3d-wrapper'>
										<div className='card-front'>
											<div className='center-wrap'>
												<div className='section text-center'>
													<h4 className='mb-4 pb-3'>Log In</h4>
													<form onSubmit={onHandleLoginSubmit}>
														<div className='htmlForm-group'>
															<input
																type='email'
																name='logemail'
																className='htmlForm-style'
																placeholder='Email'
																id='logemail'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-at' />
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
															<i className='input-icon uil uil-lock-alt' />
														</div>
														<button type='submit' className='btn mt-4'>
															Connexion
														</button>
													</form>
													{loginMutation.isError ? (
														<p>
															Erreur: {(loginMutation.error as Error).message}
														</p>
													) : undefined}
												</div>
											</div>
										</div>
										<div className='card-back'>
											<div className='center-wrap'>
												<div className='section text-center'>
													<h4 className='mb-4 pb-3'>Sign Up</h4>
													<form onSubmit={onHandleSignupSubmit}>
														<div className='htmlForm-group'>
															<input
																type='text'
																name='logname'
																className='htmlForm-style'
																placeholder='Pseudo'
																id='logname'
																autoComplete='off'
															/>
															<i className='input-icon uil uil-user' />
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
															<i className='input-icon uil uil-at' />
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
															<i className='input-icon uil uil-lock-alt' />
														</div>
														<button type='submit' className='btn mt-4'>
															Inscription
														</button>
														{signupMutation.isLoading ? (
															<p>Chargement...</p>
														) : undefined}
														{signupMutation.isError ? (
															<p>
																Erreur:{' '}
																{(signupMutation.error as Error).message}
															</p>
														) : undefined}
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
		</div>
	)
}

export default Accueil
