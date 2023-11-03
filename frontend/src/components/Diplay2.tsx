import React, { Component } from 'react'

export default class Diplay2 extends Component {
	render() {
		return (
			<div className='overflow-x-hidden bg-gray-100'>
				<nav className='bg-white px-6 py-4 shadow'>
					<div className='container mx-auto flex flex-col md:flex-row md:items-center md:justify-between'>
						<div className='flex items-center justify-between'>
							<div>
								<a
									href='#'
									className='text-xl font-bold text-gray-800 md:text-2xl'
								>
									Brand
								</a>
							</div>
							<div>
								<button
									type='button'
									className='block text-gray-800 hover:text-gray-600 focus:text-gray-600 focus:outline-none md:hidden'
								>
									<svg viewBox='0 0 24 24' className='h-6 w-6 fill-current'>
										<path d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'></path>
									</svg>
								</button>
							</div>
						</div>
						<div className='hidden flex-col md:-mx-4 md:flex md:flex-row'>
							<a
								href='#'
								className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'
							>
								Home
							</a>
							<a
								href='#'
								className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'
							>
								Blog
							</a>
							<a
								href='#'
								className='my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0'
							>
								About us
							</a>
						</div>
					</div>
				</nav>

				<div className='px-6 py-8'>
					<div className='container mx-auto flex justify-between'>
						<div className='w-full lg:w-8/12'>
							<div className='flex items-center justify-between'>
								<h1 className='text-xl font-bold text-gray-700 md:text-2xl'>
									Post
								</h1>
								<div>
									<select className='w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'>
										<option>Latest</option>
										<option>Last Week</option>
									</select>
								</div>
							</div>
							<div className='mt-6'><div class="max-w-4xl px-10 py-6 mx-auto bg-white rounded-lg shadow-md">
                        <div class="flex items-center justify-between"><span class="font-light text-gray-600">Jun 1,
                                2020</span><a href="#"
                                class="px-2 py-1 font-bold text-gray-100 bg-gray-600 rounded hover:bg-gray-500">Laravel</a>
                        </div>
                        <div class="mt-2"><a href="#" class="text-2xl font-bold text-gray-700 hover:underline">Build
                                Your New Idea with Laravel Freamwork.</a>
                            <p class="mt-2 text-gray-600">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim
                                reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!</p>
                        </div>
                        <div class="flex items-center justify-between mt-4"><a href="#"
                                class="text-blue-500 hover:underline">Read more</a>
                            <div><a href="#" class="flex items-center"><img
                                        src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=731&amp;q=80"
                                        alt="avatar" class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block">
                                    <h1 class="font-bold text-gray-700 hover:underline">Alex John</h1>
                                </a></div>
                        </div>
                    </div></div>
							<div className='mt-6'>{/* Pagination */}</div>
						</div>
						<div className='-mx-8 hidden w-4/12 lg:block'>
							{/* Sidebar content */}
						</div>
					</div>
				</div>
				<footer className='bg-gray-800 px-6 py-2 text-gray-100'>
					<div className='container mx-auto flex flex-col items-center justify-between md:flex-row'>
						<a href='#' className='text-2xl font-bold'>
							Brand
						</a>
						<p className='mt-2 md:mt-0'>All rights reserved 2020.</p>
						<div className='-mx-2 mb-2 mt-4 flex md:mb-0 md:mt-0'>
							<a href='#' className='mx-2 text-gray-100 hover:text-gray-400'>
								<svg viewBox='0 0 512 512' className='h-4 w-4 fill-current'>
									{/* Twitter Icon SVG Path */}
								</svg>
							</a>
							<a href='#' className='mx-2 text-gray-100 hover:text-gray-400'>
								<svg viewBox='0 0 512 512' className='h-4 w-4 fill-current'>
									{/* Facebook Icon SVG Path */}
								</svg>
							</a>
							<a href='#' className='mx-2 text-gray-100 hover:text-gray-400'>
								<svg viewBox='0 0 512 512' className='h-4 w-4 fill-current'>
									{/* Instagram Icon SVG Path */}
								</svg>
							</a>
						</div>
					</div>
				</footer>
			</div>
		)
	}
}
