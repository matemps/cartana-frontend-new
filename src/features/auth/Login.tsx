import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import useTitle from '../../hooks/useTitle'
import { PulseLoader } from 'react-spinners'
import useAuth from '../../hooks/useAuth'
import styles from './Login.module.css'

const Login = () => {
    useTitle('Login')

    const { user, token } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [stayLoggedIn, setStayLoggedIn] = useState(false)

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const stayLoggedInRef = useRef<HTMLInputElement>(null)

    const [login, {
        isLoading,
        isSuccess,
        error
    }] = useLoginMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) {
            if (stayLoggedInRef?.current?.checked)
                localStorage.setItem('auth', JSON.stringify({ user: user, token: token }))

            navigate('/cars')
        }
    }, [isSuccess, user, token, navigate])

    useEffect(() => {
        if (email && password) login({ email: email, password: password })
    }, [email, password, login])

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (emailRef?.current?.value) setEmail(emailRef.current.value)
        if (passwordRef?.current?.value) setPassword(passwordRef.current.value)
        if (stayLoggedInRef?.current?.checked) setStayLoggedIn(stayLoggedInRef.current.checked)
    }

    const errMsg = error
    ? 'status' in error
        ? 'error' in error
            ? <p className="errmsg">{error.error}</p>
            : <p className="errmsg">{JSON.stringify(error.data)}</p>
        : <p className="errmsg">{error.message}</p>
    : isSuccess
        ? <p>New User Created.</p>
        : null

    const errClassName = error ? styles.err : "offscreen"

    const content = isLoading
        ? <PulseLoader />
        : (
            <section>
                <header className={styles.header}>
                    <h1>Login</h1>
                </header>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={errClassName}>
                        {errMsg}
                    </div>
                    <div className={styles.fields}>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input
                                defaultValue={email}
                                ref={emailRef}
                                type="email"
                                id="email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password: </label>
                            <input
                                defaultValue={password}
                                ref={passwordRef}
                                type="password"
                                id="password"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="stayLoggedIn">
                                <input
                                    defaultChecked={stayLoggedIn}
                                    ref={stayLoggedInRef}
                                    type="checkbox"
                                    id="stayLoggedIn"
                                />
                                Stay Logged In
                            </label>
                        </div>

                        <button className={styles.loginButton}>Login</button>
                    </div>
                </form>
                
                <div>
                    <p><Link to="/register">Create New User</Link></p>
                </div>
            </section>
        )
    return content
}

export default Login
