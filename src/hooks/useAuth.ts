import { useAppSelector } from '../app/hooks'
import { selectAuth } from '../features/auth/authSlice'

const useAuth = () => {
    const { user, token } = useAppSelector(selectAuth)
    return { user, token }
}

export default useAuth
