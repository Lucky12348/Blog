// hooks/useUserInfo.js

import { useEffect, useState } from 'react'

const useUserInfo = () => {
	const [userInfo, setUserInfo] = useState(null)

	useEffect(() => {
		const fetchUserInfo = async () => {
			const token = localStorage.getItem('token')
			if (token) {
				try {
					const response = await fetch('http://localhost:8000/user/me', {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					})

					if (!response.ok) {
						throw new Error(
							"Erreur lors de la récupération des informations de l'utilisateur"
						)
					}

					const data = await response.json()
					setUserInfo(data)
				} catch (error) {
					console.error(error)
				}
			}
		}

		fetchUserInfo()
	}, [])

	return userInfo
}

export default useUserInfo
