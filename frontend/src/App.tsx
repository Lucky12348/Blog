import type { ReactElement } from 'react'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Gallery = lazy(async () => import('pages/Gallery'))
const Details = lazy(async () => import('pages/Details'))

export default function App(): ReactElement {
	return (
		<BrowserRouter>
				<Routes>
					<Route path='/' element={<Gallery />} />
					<Route path=':fruitName' element={<Details />} />
				</Routes>
		</BrowserRouter>
	)
}
