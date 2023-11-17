/* eslint-disable */
import { useInfiniteQuery } from '@tanstack/react-query'
import logoDefault from '../../public/images/defaultPost.png'

export interface Post {
	_id: string
	title: string
	description: string
	image: string
	date: string
	auteur?: string
}

const fetchGet = async ({ pageParam: pageParameter = 0 }): Promise<Post[]> => {
	const limit = pageParameter === 0 ? 4 : 3 // 4 pour la première page, 3 pour les suivantes
	const response = await fetch(
		`http://localhost:8000/posts?limit=${limit}&offset=${pageParameter}`
	)
	if (!response.ok) {
		throw new Error('Network response was not ok')
	}
	return response.json() as Promise<Post[]>
}

function DisplayPosts() {
	const {
		data,
		isError,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteQuery(['posts'], fetchGet, {
		getNextPageParam: (lastPage, allPages) => {
			// S'il n'y a pas de posts sur la dernière page, il n'y a plus de pages à charger
			if (lastPage.length === 0) return
			// Calculez le nouvel offset en fonction du nombre total de posts chargés
			const nextPageOffset = allPages.flat().length
			return nextPageOffset
		}
	})

	if (isLoading) {
		return <p>Loading...</p>
	}

	if (isError) {
		return <p>Error: {(error as Error).message}</p>
	}

	// Concaténer tous les posts de chaque page chargée
	const posts = data.pages.flat()

	if (posts.length === 0) {
		return <p>No posts to display</p>
	}

	const firstPost = posts[0]
	const otherPosts = posts.slice(1)

	return (
		<section>
			<div className='container mx-auto max-w-6xl space-y-6 p-6 sm:space-y-12'>
				{/* Première carte */}
				<a
					rel='noopener noreferrer'
					href={`detailsPost?idPost=${firstPost._id}`}
					className='group mx-auto block rounded hover:no-underline focus:no-underline dark:bg-gray-900 lg:grid lg:grid-cols-12'
				>
					<img
						src={firstPost.image || logoDefault}
						alt={firstPost.title}
						className='w-full rounded object-cover dark:bg-gray-500 sm:h-96 lg:col-span-7'
					/>
					<div className='space-y-2 p-6 lg:col-span-5'>
						<h4 className='text-2xl font-semibold group-hover:underline group-focus:underline sm:text-4xl'>
							{firstPost.title.length > 20
								? `${firstPost.title.slice(0, 27)}...`
								: firstPost.title}
						</h4>
						<span className='text-xs dark:text-gray-400'>{firstPost.date}</span>
						<p className='text-sm dark:text-gray-400'>
							{firstPost.description.length > 20
								? `${firstPost.description.slice(0, 25)}...`
								: firstPost.description}
						</p>
						<div className='inline-flex space-x-2'>
							<p className='text-base dark:text-gray-400'>auteur :</p>
							<p className='text-base dark:text-gray-300'>
								{firstPost.auteur ? firstPost.auteur : 'anonymus'}
							</p>
						</div>
					</div>
				</a>
				{/* Autres cartes */}
				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{otherPosts.map(post => (
						<a
							key={post._id}
							rel='noopener noreferrer'
							href={`detailsPost?idPost=${post._id}`}
							className='group mx-auto max-w-sm rounded hover:no-underline focus:no-underline dark:bg-gray-900'
						>
							<img
								role='presentation'
								className='w-full rounded object-cover dark:bg-gray-500'
								style={{ height: '50%' }}
								src={post.image || logoDefault}
							/>
							<div className='space-y-2 p-6'>
								<h4 className='text-2xl font-semibold group-hover:underline group-focus:underline'>
									{post.title.length > 20
										? `${post.title.slice(0, 23)}...`
										: post.title}
								</h4>
								<span className='text-xs dark:text-gray-400'>{post.date}</span>
								<p className='text-sm dark:text-gray-400'>
									{post.description.length > 20
										? `${post.description.slice(0, 25)}...`
										: post.description}
								</p>
								{post.auteur ? post.auteur : 'anonymus'}
							</div>
						</a>
					))}
				</div>
				{hasNextPage ? (
					<div className='flex justify-center'>
						<button
							type='button'
							onClick={async () => fetchNextPage()}
							disabled={isFetchingNextPage}
							className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-900 dark:text-gray-400'
						>
							{isFetchingNextPage ? 'Loading more...' : 'Load more posts...'}
						</button>
					</div>
				) : // eslint-disable-next-line unicorn/no-null
				null}
			</div>
		</section>
	)
}

export default DisplayPosts
