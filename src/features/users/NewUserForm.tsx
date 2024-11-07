import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import usetitle from '../../hooks/useTitle'
import { PulseLoader } from 'react-spinners'
import styles from './NewUserForm.module.css'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    usetitle('Register')

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const [addNewUser, {
        isSuccess,
        isLoading,
        error
    }] = useAddNewUserMutation()

    useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email])
    useEffect(() => setValidPassword(PWD_REGEX.test(password)), [password])

    const canSave = [validEmail, validPassword].every(Boolean) && !isLoading

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (canSave) addNewUser({ email, password })
    }

    const statusMsg = error
        ? 'status' in error
            ? 'error' in error
                ? error.error
                : JSON.stringify(error.data)
            : error.message
        : isSuccess
            ? <p>New User Created.</p>
            : null
    
    const validEmailClass = !validEmail ? "form__input--incomplete" : ""
    const validPasswordClass = !validPassword ? "form__input--incomplete" : ""

    const content = isLoading
        ? <PulseLoader />
        : (
            <section>
                <header className={styles.header}>
                    <h1>Register</h1>
                </header>
                <form className={styles.registerForm} onSubmit={handleSubmit}>
                    <div>
                        {statusMsg}
                    </div>
                    <div className={styles.fields}>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input
                                className={`form__input ${validEmailClass}`}
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password: <span className="nowrap">[4-12 chars incl. !@#$%] </span></label>
                            <input
                                className={`form__input ${validPasswordClass}`}
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className={styles.registerButton} disabled={!canSave}>Register</button>
                    </div>
                </form>
            </section>
        )
    return content
}

export default NewUserForm
