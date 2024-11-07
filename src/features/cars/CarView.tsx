import useTitle from '../../hooks/useTitle'
import useAuth from '../../hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetCarByCarIdQuery, useGetReservationStatusQuery, useSetCarReservationMutation } from './carsApiSlice'
import { PulseLoader } from 'react-spinners'
import Timer from '../../components/shared/Timer'
import styles from './CarView.module.css'

const CarView = () => {
    const { carId } = useParams()
    const navigate = useNavigate()
    const { user, token } = useAuth()

    let errors : Array<string> = []

    // init title
    let title

    const {
        data,
        isLoading,
        error
    } = useGetCarByCarIdQuery(Number(carId))

    if (error) {
        const err = 'status' in error
            ? 'error' in error
                ? error.error
                : JSON.stringify(error.data)
            : error.message
        
        if (err) errors.push(err)
    }

    type reservation = { id: number, car_id: number, user_id: number, exp_time: string } | { message: string }
    
    // useGetReservationStatusQuery returns array of [status: number, response: Object]
    // a 404 response has a message that says the requested reservation could not be found
    // a 200 response can either have the reservation or a message saying that the reservation time for the requested reservation has expired.

    const {
        data: resData,
        isSuccess: isSuccessRes,
        isFetching: isFetchingRes,
        isLoading: isLoadingRes,
        error: errorRes,
        refetch: refetchRes
    } = useGetReservationStatusQuery(Number(carId), {skip: token === null})

    if (errorRes) {
        const err = 'status' in errorRes
            ? 'error' in errorRes
                ? errorRes.error
                : JSON.stringify(errorRes.data)
            : errorRes.message
        
        if (err) errors.push(err)
    }

    const [setReservation] = useSetCarReservationMutation()

    const handleReserve = async () => {
        try {
            await setReservation({ car_id: Number(carId), user_id: user.id })
            refetchRes()
        } catch (err) {
            console.log(err)
        }
    }

    const handlePurchase = () => navigate(`/cars/${carId}/purchase`)

    let context
    if (isLoading) {
        context = <PulseLoader />
        title = 'Loading...'
    }
    else if (errors.length) {
        title = 'Error'

        const errorsJSX = errors.map((err, i) => {
            return <p key={i}>{err}</p>
        })
        context = (
            <div>
                {errorsJSX}
            </div>
        )
    }
    else {
        title = `${data?.year} ${data?.manufacturer} ${data?.model}`

        let reservePurchaseButton = null
        let reserveTimer = null
        
        if (isLoadingRes || isFetchingRes) {
            reservePurchaseButton = <PulseLoader />
        }
        else if (isSuccessRes) {
            if (resData && (resData[0] === 200 || resData[0] === 404) && resData[1] && 'message' in (resData[1] as reservation)) {
                // user is logged in and car is not reserved by anyone

                reservePurchaseButton = <button className={styles.reservePurchaseButton} onClick={handleReserve}>Reserve</button>
            }
            else if (resData && resData[0] === 200 && resData[1]) {
                // user is logged in and car is reserved by user

                const c = resData[1] as reservation
                if ('user_id' in c && c.user_id === user.id) {
                    // split timestamp into [ Y, M, D, h, m, s ]
                    const t = c.exp_time.split(/[- :]/)

                    const deadline = Date.UTC(Number(t[0]), Number(t[1])-1, Number(t[2]), Number(t[3]), Number(t[4]), Number(t[5]))
                    
                    reserveTimer = <Timer deadline={deadline} fn={refetchRes} />
                    reservePurchaseButton = <button className={styles.reservePurchaseButton} onClick={handlePurchase}>Purchase</button>
                }
            }
        }
        
        let jsxEntries = []
        if (data) {
            const entries = { odo: data.odo, body: data.body, color: data.color, fuel: data.fuel, vin: data.vin }
            for (const [key, value] of Object.entries(entries)) {
                if (value) jsxEntries.push(
                    <div key={key}>
                        <h4>
                            {key}: {value}
                        </h4>
                    </div>
                )
            }
        }

        context = (
            <>
                <header className={styles.header}>
                    <h1>{data?.year} {data?.manufacturer} {data?.model}</h1>
                </header>
                <div className={styles.reserveCard}>
                    {reserveTimer}
                    {reservePurchaseButton}
                </div>
                <div>
                    <h3>Price: ${data?.price}</h3>
                    <div>
                        {jsxEntries}
                    </div>
                </div>
            </>
        )
    }

    // set title
    useTitle(title)

    const content = (
        <section>
            {context}
        </section>
    )
    return content
}

export default CarView
