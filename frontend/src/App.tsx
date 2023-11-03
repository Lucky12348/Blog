// App.tsx
import type { ReactElement } from 'react'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddPost from './components/AddPost'
import DisplayPosts from './components/DisplayPost'
import ProtectedPage from './components/ProtectedPage'
import Accueil from './pages/Accueil'
import { SuperBlog } from './pages/SuperBlog'

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Accueil />} />
				<Route
					path='/blog'
					element={
						<ProtectedPage>
							<SuperBlog />
						</ProtectedPage>
					}
				/>
				<Route
					path='/addPost'
					element={
						<ProtectedPage>
							<AddPost />
						</ProtectedPage>
					}
				/>
				<Route
					path='/affPost'
					element={
						<ProtectedPage>
							<DisplayPosts />
						</ProtectedPage>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
