import { Link } from 'react-router-dom'
import { useGetTransactionsQuery } from './transactionsApiSlice'
import { PulseLoader } from 'react-spinners'
import useTitle from '../../hooks/useTitle'
import styles from './Transactions.module.css'

const Transactions = () => {
    // init title
    let title

    const { data, isLoading, isError, error } = useGetTransactionsQuery()

    let context
    if (isLoading) {
        context = <PulseLoader />
        title = 'Loading...'
    }
    else if (isError) {
        title = 'Error'
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
            
            context = <div>{errMsg}</div>
        } else {
            // you can access all properties of `SerializedError` here
            context = <div>{error.message}</div>
        }
    }
    else {
        title = 'Transactions'

        context = <p>No transactions</p>
        if (data?.length) {
            const links = data?.map((tr, i) => {
                return <li key={i}><Link to={`/transactions/${tr.id}`} state={{ transaction: tr }}>Transaction #{tr.id}</Link></li>
            }) || null

            context = (
                <ul className={styles.transactions}>
                    {links}
                </ul>
            )
        }
    }

    // set title
    useTitle(title)

    const content = (
        <section>
            <header className={styles.header}>
                <h1>Transactions</h1>
            </header>
            {context}
        </section>
    )
    return content
}

export default Transactions
