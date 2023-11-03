import React, { useEffect, useState } from 'react'
import '../../public/css/display.css'
import logoDefault from '../../public/images/defaultPost.png'

function DisplayPosts() {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('http://localhost:8000/getPosts')
			.then(response => response.json())
			.then(data => {
				setPosts(data)
				setLoading(false)
			})
			.catch(error => {
				console.error('Erreur lors de la récupération des posts:', error)
				setLoading(false)
			})
	}, [])

	const getCardClass = index => {
		const classes = ['blue', 'red', 'green', 'yellow']
		return classes[index % 4]
	}

	if (loading) {
		return <div>Chargement des posts...</div>
	}

	return (
		<>
			<h2>Liste des posts</h2>
			{posts.map((post, index) => {
				const cardClass = getCardClass(index)
				return (
					<>
						<article key={index} className={`postcard dark ${cardClass} `}>
							<a className='postcard__img_link' href='#'>
								<img
									className='postcard__img'
									src={
										post.image
											? `data:image/jpeg;base64,${post.image}`
											: logoDefault
									}
									alt={post.title}
								/>
							</a>
							<div className='postcard__text'>
								<h1 className={`postcard__title ${cardClass}`}>
									<a href='#'>{post.title}</a>
								</h1>
								<div className='postcard__subtitle small'>
									<time dateTime='2020-05-25 12:00:00'>
										<i className='fas fa-calendar-alt mr-2'></i>Mon, May 25th
										2020
									</time>
								</div>
								<div className='postcard__bar'></div>
								<div className='postcard__preview-txt'>
									{post.description.length > 50
										? post.description.substring(0, 50) + '...'
										: post.description}
								</div>
								<ul className='postcard__tagbox'>
									<li className='tag__item'>
										<i className='fas fa-tag mr-2'></i>Catégorie
									</li>
									<li className='tag__item'>
										<i className='fas fa-clock mr-2'></i>55 mins.
									</li>
									<li className={`tag__item play ${cardClass}`}>
										<a href='#'>
											<i className='fas fa-play mr-2'></i>Lire
										</a>
									</li>
								</ul>
							</div>
						</article>
					</>
				)
			})}
		</>
	)
}

export default DisplayPosts
