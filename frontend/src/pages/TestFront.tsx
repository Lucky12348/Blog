/* eslint-disable */
export default function TestFront(): React.ReactElement {
	return (
		<>
			{/* component */}
			<form>
				<div className='min-h-screen bg-indigo-50 pt-6 md:px-20'>
					<div className=' mx-auto max-w-2xl rounded-md bg-white px-6 py-10'>
						<h1 className='mb-10 text-center text-2xl font-bold text-gray-500'>
							ADD POST
						</h1>
						<div className='space-y-4'>
							<div>
								<label htmlFor='title' className='text-lx font-serif'>
									Title:
								</label>
								<input
									type='text'
									placeholder='title'
									id='title'
									className='text-md ml-2 rounded-md border-2 px-2 py-1 outline-none'
								/>
							</div>
							<div>
								<label
									htmlFor='description'
									className='mb-2 block font-serif text-lg'
								>
									Description:
								</label>
								<textarea
									id='description'
									cols={30}
									rows={10}
									placeholder='whrite here..'
									className='w-full rounded-md  bg-indigo-50 p-4 font-serif text-gray-600 outline-none'
									defaultValue=''
								/>
							</div>{' '}
							<label
								className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
								htmlFor='file_input'
							>
								Upload file
							</label>
							<input
								className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
								id='file_input'
								type='file'
							/>
							<button className=' mx-auto block rounded-md bg-indigo-600 px-6 py-2 text-lg font-semibold text-indigo-100'>
								ADD POST
							</button>
						</div>
					</div>
				</div>
			</form>
		</>
	)
}
