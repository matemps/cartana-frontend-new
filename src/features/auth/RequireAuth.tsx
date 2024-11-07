import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const RequireAuth = () => {
    const location = useLocation()
    const { token } = useAuth()

    const content = (
        token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
    return content
}

export default RequireAuth
