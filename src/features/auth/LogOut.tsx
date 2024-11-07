import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from './authApiSlice'

const LogOut = () => {
    const navigate = useNavigate()
    const [sendLogout, { error, isSuccess }] = useSendLogoutMutation()

    let context = <p>Please wait...</p>
    if (error) {
        const errMsg = 'status' in error
        ? 'error' in error
            ? error.error
            : JSON.stringify(error.data)
        : error.message

        context = <p>{errMsg}</p>
    }
    
    const effectRan = useRef(false)

    useEffect(() => {
        if (isSuccess)
            navigate('/cars')
    }, [isSuccess])
    
    useEffect(() => {
        if (effectRan.current || process.env.NODE_ENV !== 'development') { // react 18 strict mode
            const foo = async () => {
                await sendLogout()
            }
            foo()
        }
        return () => { effectRan.current = true }
    }, [])

    return context
}

export default LogOut
