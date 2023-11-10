// App.tsx
import type { ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddPost from './components/AddPost'
import DisplayPosts from './components/DisplayPost'
import ProtectedPage from './components/ProtectedPage'
import DetailsPost from './pages/DetailsPost'
import SuperBlog from './pages/SuperBlog'
import TestFront from './pages/TestFront'
import './tailwind.css'

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<SuperBlog />} />
				<Route
					path='/addPost'
					element={
						<ProtectedPage>
							<AddPost />
						</ProtectedPage>
					}
				/>
				<Route path='/affPost' element={<DisplayPosts />} />
				<Route
					path='/detailsPost'
					element={
						<ProtectedPage>
							<DetailsPost />
						</ProtectedPage>
					}
				/>
				<Route
					path='/front'
					element={
						<ProtectedPage>
							<TestFront />
						</ProtectedPage>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
