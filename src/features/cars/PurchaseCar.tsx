import { useRef, useState, useEffect } from 'react'
import useTitle from '../../hooks/useTitle'
import states from '../../data/states'
import { useParams, useNavigate } from 'react-router-dom'
import Timer from '../../components/shared/Timer'
import { useGetReservationStatusQuery } from './carsApiSlice'
import { useCreateTransactionMutation } from '../transactions/transactionsApiSlice'
import { PulseLoader } from 'react-spinners'
import styles from './PurchaseCar.module.css'

const PurchaseCar = () => {
    const { carId } = useParams()
    const navigate = useNavigate()

    let errs : Array<string> = []

    // init title
    let title = 'Purchase'

    const [errFields, setErrFields] = useState(Array<string>())

    const [state, setState] = useState('')
    const [validState, setValidState] = useState(false)
    const [city, setCity] = useState('')
    const [validCity, setValidCity] = useState(false)
    const [zip, setZip] = useState('')
    const [validZip, setValidZip] = useState(false)
    const [address, setAddress] = useState('')
    const [validAddress, setValidAddress] = useState(false)
    const [payment, setPayment] = useState('')
    const [acctType, setAcctType] = useState('')
    const [validAcctType, setValidAcctType] = useState(false)
    const [accountFName, setAccountFName] = useState('')
    const [validAccountFName, setValidAccountFName] = useState(false)
    const [accountLName, setAccountLName] = useState('')
    const [validAccountLName, setValidAccountLName] = useState(false)
    const [accountNumber, setAccountNumber] = useState('')
    const [validAccountNumber, setValidAccountNumber] = useState(false)
    const [routing, setRouting] = useState('')
    const [validRouting, setValidRouting] = useState(false)
    const [cardFName, setCardFName] = useState('')
    const [validCardFName, setValidCardFName] = useState(false)
    const [cardLName, setCardLName] = useState('')
    const [validCardLName, setValidCardLName] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [validCardNumber, setValidCardNumber] = useState(false)
    const [exp, setExp] = useState('')
    const [expMonth, setExpMonth] = useState('')
    const [expYear, setExpYear] = useState('')
    const [validExp, setValidExp] = useState(false)
    const [cvv, setCVV] = useState('')
    const [validCVV, setValidCVV] = useState(false)

    const stateRef = useRef<HTMLSelectElement>(null)
    const cityRef = useRef<HTMLInputElement>(null)
    const zipRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const acctTypeRef = useRef<HTMLSelectElement>(null)
    const accountFNameRef = useRef<HTMLInputElement>(null)
    const accountLNameRef = useRef<HTMLInputElement>(null)
    const accountNumberRef = useRef<HTMLInputElement>(null)
    const routingRef = useRef<HTMLInputElement>(null)
    const cardFNameRef = useRef<HTMLInputElement>(null)
    const cardLNameRef = useRef<HTMLInputElement>(null)
    const cardNumberRef = useRef<HTMLInputElement>(null)
    const expMonthRef = useRef<HTMLInputElement>(null)
    const expYearRef = useRef<HTMLInputElement>(null)
    const cvvRef = useRef<HTMLInputElement>(null)

    type reservation = { id: number, car_id: number, user_id: number, exp_time: string } | { message: string }

    // useGetReservationStatusQuery returns array of [status: number, response: Object]
    // a 404 response has a message that says the requested reservation could not be found
    // a 200 response can either have the reservation or a message saying that the reservation time for the requested reservation has expired.
    
    const {
        data,
        isFetching,
        isSuccess,
        isLoading,
        error,
        refetch
    } = useGetReservationStatusQuery(Number(carId))

    if (error) {
        const err = 'status' in error
            ? 'error' in error
                ? error.error
                : JSON.stringify(error.data)
            : error.message
        
        if (err) errs.push(err)
    }
    
    useEffect(() => {
        if ( (isSuccess && !data) || (data && (data[0] === 200 || data[0] === 404) && data[1] && 'message' in (data[1] as reservation)) )
            navigate(`/cars/${carId}`, { replace: true })
    }, [data, navigate, carId])

    const [purchaseCar, { data: purchaseData, isLoading: isLoadingPurchase, isSuccess: isSuccessPurchase, error: purchaseError }] = useCreateTransactionMutation()

    if (purchaseError) {
        const err = 'status' in purchaseError
            ? 'error' in purchaseError
                ? purchaseError.error
                : JSON.stringify(purchaseError.data)
            : purchaseError.message
        
        if (err) errs.push(err)
    }

    useEffect(() => {
        if (validState && validCity && validZip && validAddress) {
            if (payment === 'chkBank' && validAcctType && validAccountFName && validAccountLName && validAccountNumber && validRouting)
                purchaseCar({ car_id: Number(carId), state, city, zip, address, payment, acctType, accountFName, accountLName, accountNumber, routing })
            else if (payment === 'chkCard' && validCardFName && validCardLName && validCardNumber && validExp && validCVV)
                purchaseCar({ car_id: Number(carId), state, city, zip, address, payment, cardFName, cardLName, cardNumber, exp, cvv })
        }
    }, [
        state, validState, city, validCity, zip, validZip, address, validAddress, payment,
        acctType, validAcctType, accountFName, validAccountFName, accountLName, validAccountLName, accountNumber, validAccountNumber, routing, validRouting,
        cardFName, validCardFName, cardLName, validCardLName, cardNumber, validCardNumber, exp, validExp, cvv, validCVV,
        carId, purchaseCar
    ])
    
    useEffect(() => {
        if (isSuccessPurchase && purchaseData)
            navigate(`/transactions/${purchaseData.id}`, { replace: true, state: { transaction: purchaseData } })
    }, [isSuccessPurchase, navigate, purchaseData])

    const handleCheck = (e: React.MouseEvent<HTMLInputElement>) => setPayment((e.target as HTMLInputElement).value)
    
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()

        let errors = []

        // to do: limit this to 32 chars
        const CITY_REGEX = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/

        const ZIP_REGEX = /^\d{5}$/
        const NAME_REGEX = /^[A-Z][a-z]{1,32}$/
        
        if (stateRef?.current?.value)
            if (states.find((obj) => obj.code === stateRef?.current?.value)) { setValidState(true); setState(stateRef.current.value) } else { setValidState(false); errors.push('Invalid state') }
        if (cityRef?.current?.value)
            if (CITY_REGEX.test(cityRef.current.value)) { setValidCity(true); setCity(cityRef.current.value) } else { setValidCity(false); errors.push('Invalid city') }
        if (zipRef?.current?.value)
            if (ZIP_REGEX.test(zipRef.current.value)) { setValidZip(true); setZip(zipRef.current.value) } else { setValidZip(false); errors.push('Invalid ZIP') }
        if (addressRef?.current?.value)
            if (addressRef.current.value !== '') { setValidAddress(true); setAddress(addressRef.current.value) } else { setValidAddress(false); errors.push('Invalid address') }
        if (payment === 'chkBank') {
            const ACCOUNT_NUMBER_REGEX = /^\d{1,32}$/
            const ROUTING_REGEX = /^\d{9}$/
            if (acctTypeRef?.current?.value)
                if (acctTypeRef.current.value === 'checkings' || acctTypeRef.current.value === 'savings') { setValidAcctType(true); setAcctType(acctTypeRef.current.value) } else { setValidAcctType(false); errors.push('Invalid bank account type') }
            if (accountFNameRef?.current?.value)
                if (NAME_REGEX.test(accountFNameRef.current.value)) { setValidAccountFName(true); setAccountFName(accountFNameRef.current.value) } else { setValidAccountFName(false); errors.push('Invalid account first name') }
            if (accountLNameRef?.current?.value)
                if (NAME_REGEX.test(accountLNameRef.current.value)) { setValidAccountLName(true); setAccountLName(accountLNameRef.current.value) } else { setValidAccountLName(false); errors.push('Invalid account last name') }
            if (accountNumberRef?.current?.value)
                if (ACCOUNT_NUMBER_REGEX.test(accountNumberRef.current.value)) { setValidAccountNumber(true); setAccountNumber(accountNumberRef.current.value) } else { setValidAccountNumber(false); errors.push('Invalid account number') }
            if (routingRef?.current?.value)
                if (ROUTING_REGEX.test(routingRef.current.value)) { setValidRouting(true); setRouting(routingRef.current.value) } else { setValidRouting(false); errors.push('Invalid routing number') }
        }
        else if (payment === 'chkCard') {
            const CARD_NUMBER_REGEX = /^\d{1,32}$/
            const EXP_MONTH_YEAR_REGEX = /^\d{2}$/
            const CVV_REGEX = /^\d{3}$/
            if (cardFNameRef?.current?.value)
                if (NAME_REGEX.test(cardFNameRef.current.value)) { setValidCardFName(true); setCardFName(cardFNameRef.current.value) } else { setValidCardFName(false); errors.push('Invalid card first name') }
            if (cardLNameRef?.current?.value)
                if (NAME_REGEX.test(cardLNameRef.current.value)) { setValidCardLName(true); setCardLName(cardLNameRef.current.value) } else { setValidCardLName(false); errors.push('Invalid card last name') }
            if (cardNumberRef?.current?.value)
                if (CARD_NUMBER_REGEX.test(cardNumberRef.current.value)) { setValidCardNumber(true); setCardNumber(cardNumberRef.current.value) } else { setValidCardNumber(false); errors.push('Invalid card number') }
            if (expMonthRef?.current?.value && expYearRef?.current?.value)
                if (EXP_MONTH_YEAR_REGEX.test(expMonthRef.current.value) && EXP_MONTH_YEAR_REGEX.test(expYearRef.current.value)) {
                    setValidExp(true)
                    setExpMonth(expMonthRef.current.value.padStart(2,'0'))
                    setExpYear(expYearRef.current.value.padStart(2,'0'))
                    setExp(expMonthRef.current.value.padStart(2,'0')+expYearRef.current.value.padStart(2,'0'))
                } else { setValidExp(false); errors.push('Invalid card expiration date') }
            if (cvvRef?.current?.value)
                if (CVV_REGEX.test(cvvRef.current.value)) { setValidCVV(true); setCVV(cvvRef.current.value) } else { setValidCVV(false); errors.push('Invalid CVV') }
        }
        else errors.push('Invalid payment')

        setErrFields(errors)
    }

    const options = states.map(state => {
        return (
            <option
                key={state.code}
                value={state.code}
            >
                {state.state}
            </option>
        )
    })

    const errFieldsClassName = errFields.length ? styles.formPart : "offscreen"
    const errFieldsContext = errFields.length
        ? errFields.map((err, i) => {
            return (
                <li key={i}>
                    <p className="errmsg">{err}</p>
                </li>
            )
        })
        : null

    let context
    let timer
    if (isFetching || isLoading || isLoadingPurchase) {
        context = <PulseLoader />
    }
    else if (errs.length) {
        title = 'Error'

        const errorsJSX = errs.map((err, i) => {
            return <p key={i}>{err}</p>
        })
        context = (
            <div>
                {errorsJSX}
            </div>
        )
    }
    else if (data && data[0] === 200 && data[1] && !isSuccessPurchase) {
        const c = data[1] as reservation
        if ('exp_time' in c) {
            // split timestamp into [ Y, M, D, h, m, s ]
            const t = c.exp_time.split(/[- :]/)

            const deadline = Date.UTC(Number(t[0]), Number(t[1])-1, Number(t[2]), Number(t[3]), Number(t[4]), Number(t[5]))
            timer = (
                <div className={styles.timer}>
                    <Timer deadline={deadline} fn={refetch} />
                </div>
            )

            context = (
                <form className={styles.purchaseCarForm} onSubmit={handleSubmit}>
                    <div className={errFieldsClassName}>
                        <ul>
                            {errFieldsContext}
                        </ul>
                    </div>
                    <div>
                        <div className={styles.formPart}>
                            <div>
                                <label htmlFor="state">State: </label>
                                <select id="state" ref={stateRef} defaultValue={state} required>
                                    {options}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="city">City: </label>
                                <input id="city" ref={cityRef} type="text" defaultValue={city} required />
                            </div>
                            <div>
                                <label htmlFor="zip">ZIP: </label>
                                <input id="zip" size={5} maxLength={5} ref={zipRef} type="text" defaultValue={zip} required />
                            </div>
                            <div>
                                <label htmlFor="address">Street Address: </label>
                                <input id="address" ref={addressRef} type="text" defaultValue={address} required />
                            </div>
                        </div>

                        <div className={styles.formPart}>
                            <div>
                                <p>Select a Payment Method.</p>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="chkBank">Banking</label>
                                    <input type="radio" value="chkBank" onClick={(e) => handleCheck(e)} checked={payment === 'chkBank'} readOnly id="chkBank" />
                                </div>
                                <div>
                                    <label htmlFor="chkCard">Card</label>
                                    <input type="radio" value="chkCard" onClick={(e) => handleCheck(e)} checked={payment === 'chkCard'} readOnly id="chkCard" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div id="bankDiv" className={styles.formPart} hidden={payment !== 'chkBank'}>
                                <div>
                                    <label htmlFor="acctType">Account Type: </label>
                                    <select id="acctType" ref={acctTypeRef} defaultValue={acctType} disabled={payment !== 'chkBank'} required>
                                        <option value="checkings">Checkings</option>
                                        <option value="savings">Savings</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="accountFName">Account Holder's First Name: </label>
                                    <input type="text" ref={accountFNameRef} defaultValue={accountFName} disabled={payment !== 'chkBank'} required id="accountFName" />
                                </div>
                                <div>
                                    <label htmlFor="accountLName">Account Holder's Last Name: </label>
                                    <input type="text" ref={accountLNameRef} defaultValue={accountLName} disabled={payment !== 'chkBank'} required id="accountLName" />
                                </div>
                                <div>
                                    <label htmlFor="accountNumber">Account Number: </label>
                                    <input type="text" ref={accountNumberRef} defaultValue={accountNumber} id="accountNumber" disabled={payment !== 'chkBank'} required />
                                </div>
                                <div>
                                    <label htmlFor="routing">Routing Number: </label>
                                    <input type="text" ref={routingRef} defaultValue={routing} id="routing" disabled={payment !== 'chkBank'} required />
                                </div>
                            </div>

                            <div id="cardDiv" className={styles.formPart} hidden={payment !== 'chkCard'}>
                                <div>
                                    <label htmlFor="cardFName">Card First Name: </label>
                                    <input type="text" ref={cardFNameRef} id="cardFName" defaultValue={cardFName} disabled={payment !== 'chkCard'} required />
                                </div>
                                <div>
                                    <label htmlFor="cardLName">Card Last Name: </label>
                                    <input type="text" ref={cardLNameRef} id="cardFName" defaultValue={cardLName} disabled={payment !== 'chkCard'} required />
                                </div>
                                <div>
                                    <label htmlFor="cardNumber">Card Number: </label>
                                    <input type="text" size={9} maxLength={9} ref={cardNumberRef} id="cardNumber" defaultValue={cardNumber} disabled={payment !== 'chkCard'} required />
                                </div>
                                <div>
                                    <p>Expiration Date: </p>
                                    <label htmlFor="expMonth" hidden>Expiration Date Month</label>
                                    <input id="expMonth" type="text" size={2} maxLength={2} ref={expMonthRef} defaultValue={expMonth} disabled={payment !== 'chkCard'} required />
                                    <label htmlFor="expYear" hidden>Expiration Date Year</label>
                                    <input id="expYear" type="text" size={2} maxLength={2} ref={expYearRef} defaultValue={expYear} disabled={payment !== 'chkCard'} required />
                                </div>
                                <div>
                                    <label htmlFor="cvv">CVV: </label>
                                    <input type="text" id="cvv" size={3} maxLength={3} ref={cvvRef} defaultValue={cvv} disabled={payment !== 'chkCard'} required />
                                </div>
                            </div>
                        </div>
                        <button>Purchase</button>
                    </div>
                </form>
            )
        }
    }

    // set title
    useTitle(title)

    const content = (
        <section>
            <header className={styles.header}>
                <h1>Purchase Car</h1>
            </header>
            {timer}
            {context}
        </section>
    )
    return content
}

export default PurchaseCar
