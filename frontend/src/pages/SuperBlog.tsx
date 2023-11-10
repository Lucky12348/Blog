import { scaleRotate as Menu } from 'react-burger-menu'
import '../../public/css/menu.css'
// eslint-disable-next-line import/extensions
import { useState } from 'react'
import logo from '../../public/images/logo.png'
import '../../public/javascripts/menu.js'
import DisplayPosts from '../components/DisplayPost'
import FormSignLog from '../components/FormSignLog'
import Modal from '../components/Modal'
import useUserInfo from '../hooks/VerifToken'

const onHandleClick = (): void => {
	localStorage.removeItem('token')
	window.location.reload()
}
function SuperBlog(): JSX.Element | null {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data: userInfo, isLoading, isError } = useUserInfo()

	// Gérer les états de chargement et d'erreur selon les besoins
	if (isLoading) {
		return <div>Loading...</div>
	}

	if (isError) {
		return <div>Error loading user info</div>
	}

	// Vérifie explicitement que userInfo est défini

	return (
		<>
			{/* Hello world */}
			<nav className='border-gray-200 bg-white dark:bg-gray-900'>
				<div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4'>
					<a className='flex items-center'>
						<img src={logo} className='mr-3 h-8' alt='Flowbite Logo' />
						<span className='self-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
							SuperBlog
						</span>
					</a>
					<div className='flex items-center'>
						{userInfo ? (
							<div>
								<a
									className='mr-3 rounded-lg bg-red-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 md:mr-0'
									href='/'
									onClick={onHandleClick}
								>
									<i className='fas fa-power-off' />
									<span> Disconnect</span>
								</a>
							</div>
						) : (
							<a
								href='#'
								className='mr-3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-0'
								onClick={() => setIsModalOpen(true)}
							>
								Login/Signup
							</a>
						)}
						<Modal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							children={<FormSignLog />}
						/>
					</div>
				</div>
			</nav>

			<div id='outer-container'>
				<Menu pageWrapId='page-wrap' outerContainerId='outer-container'>
					<a className='bm-item' href='/'>
						<span>Accueil</span>
					</a>
					<a className='bm-item' href='/addpost'>
						<span>Add Post</span>
					</a>

					<a className='bm-item' href='/affPost'>
						<span>Display Post(s)</span>
					</a>
					<a className='bm-item' href='/front'>
						<i className='fa fa-fw fa-database' />
						<span>TestFrontend</span>
					</a>

					{/* ici d'autre liens */}
				</Menu>
				<main id='page-wrap'>
					{/* Votre contenu principal ici */}
					<h1 className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-gray-500 md:text-5xl lg:text-6xl'>
						Bienvenue{' '}
						<span className='bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent'>
							{userInfo.name} !
						</span>
					</h1>
					<p className='text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl'>
						Ici les derniers posts ↓
					</p>

					<DisplayPosts />
				</main>
			</div>
		</>
	)
}
export default SuperBlog
