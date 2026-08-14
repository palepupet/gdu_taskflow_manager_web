import { useEffect, useState } from 'react'
import { login as loginRequest } from '../api/auth.js'
import { getMe } from '../api/profile.js'
import { AuthContext } from './auth-context.js'
import {setOnUnauthorized} from "../api/client.js";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types"

export function AuthProvider({ children }) {
    const navigate = useNavigate();

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

    useEffect(() => {
        setOnUnauthorized( () => {
            setUser(null);
            navigate('/login', {
                state: { message: 'Session expirée.'},
            })
        })
    }, [navigate])

    async function login(email, password) {
        await loginRequest(email, password)
        const profile = await getMe()
        setUser(profile)
    }

    function logout() {
        sessionStorage.removeItem('token')
        navigate('/login')
        setUser(null)
    }

    function updateUserProfile(updatedUser) {
        setUser(updatedUser);
    }

    const value = {
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
        updateUserProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}