import React from 'react'
import { scaleRotate as Menu } from 'react-burger-menu'
import '../../public/css/menu.css'
import '../../public/javascripts/menu.js'
import DisplayPosts from '../components/DisplayPost'
import useUserInfo from '../hooks/VerifToken'

export function SuperBlog() {
	const handleClick = () => {
		localStorage.removeItem('token')
		window.location.reload()
	}
	const userInfo = useUserInfo()

	if (!userInfo) return null // ou afficher un loader, etc.

	return (
		<div id='outer-container'>
			<Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
				<h2 className='bm-item'>
					<i className='fa fa-fw fa-inbox fa-2x'></i>
					<span>SuperBlog</span>
				</h2>
				<a className='bm-item' href='/' onClick={handleClick}>
					<i className='fa fa-fw fa-database'></i>
					<span>Disconnect</span>
				</a>
				<a className='bm-item' href='/addPost'>
					<span>Add Post</span>
				</a>
				<a className='bm-item' href='/affPost'>
					<span>Display Post(s)</span>
				</a>
				{/* Ajoutez d'autres liens ou contenus ici */}
			</Menu>
			<main id='page-wrap'>
				{/* Votre contenu principal ici */}
				<h1>Bienvenue {userInfo._id} !</h1>
				<p>Ceci est le contenu principal de la page.</p>
				<DisplayPosts />
			</main>
		</div>
	)
}
