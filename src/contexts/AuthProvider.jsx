import { useEffect, useState } from 'react'
import { login as loginRequest } from '../api/auth.js'
import { getMe } from '../api/profile.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            const token = sessionStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const profile = await getMe()
                setUser(profile)
            } catch {
                sessionStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    async function login(email, password) {
        await loginRequest(email, password)
        const profile = await getMe()
        setUser(profile)
    }

    function logout() {
        sessionStorage.removeItem('token')
        setUser(null)
    }

    const value = {
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}