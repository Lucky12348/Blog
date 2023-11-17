import type React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedPage({
	children
}: {
	children: React.ReactNode
}): React.ReactNode {
	const token = localStorage.getItem('token')

	if (!token) {
		return <Navigate to='/' />
	}

	return children
}
