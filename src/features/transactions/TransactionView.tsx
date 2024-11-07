import { useLocation, useParams } from 'react-router-dom'
import { useGetTransactionByIdQuery } from './transactionsApiSlice'
import { PulseLoader } from 'react-spinners'
import useTitle from '../../hooks/useTitle'
import styles from './TransactionView.module.css'

const TransactionView = () => {
    const { transactionId } = useParams()

    // init title
    let title

    const location = useLocation()
    const { data, isLoading, isError, error } = useGetTransactionByIdQuery(Number(transactionId), { skip: typeof(location?.state?.transaction) !== 'undefined' || false })

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
        type transaction = { id: number, car_id: number, state: string, city: string, zip: string, address: string, payment: string, acctType: string, accountFName: string, accountLName: string, accountNumber: string, routing: string }
            | { id: number, car_id: number, state: string, city: string, zip: string, address: string, payment: string, cardFName: string, cardLName: string, cardNumber: string, exp: string, cvv: string }

        const transaction : transaction = location?.state?.transaction || data
        title = `Transaction #${transaction.id}`

        let fields = []
        for (const [key, value] of Object.entries(transaction)) {
            fields.push(
                <p key={key}><b>{key}: </b>{value}</p>
            )
        }
        context = (
            <div>
                {fields}
            </div>
        )
    }
    
    // set title
    useTitle(title)
    
    const content = (
        <section>
            <header className={styles.header}>
                <h1>Transaction View</h1>
            </header>
            {context}
        </section>
    )
    return content
}

export default TransactionView
