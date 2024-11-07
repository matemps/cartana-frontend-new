import { Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Header = () => {
    const { pathname } = useLocation()
    const { token } = useAuth()

    // Don't show navbar for login, logout, and registration pages
    let navbar = <></>
    if (pathname !== '/login' && pathname !== '/logout' && pathname !== '/register') {
        let logInLink = <li><Link to="/login">Login</Link></li>
        let transactionsLink = <></>
        let logOut = <></>

        if (token) {
            logInLink = <></>
            transactionsLink = <li><Link to="/transactions">Transactions</Link></li>
            logOut = <Link to="/logout">Log Out</Link>
        }

        navbar = (
            <nav>
                <ul>
                    {logInLink}
                    <li><Link to="/cars">Search Cars</Link></li>
                    {transactionsLink}
                    {logOut}
                </ul>
            </nav>
        )
    }

    const content = (
        <header className="master-header">
            <Link to="/"><img id="cartana-logo" src="src/assets/cartana.png" /></Link>
            {navbar}
        </header>
    )
    return content
}

export default Header
