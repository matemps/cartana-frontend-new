import { useState, useEffect } from 'react'
import styles from './Timer.module.css'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

interface IProps {
    deadline: number
    fn: () => any | void
}

const Timer = ({deadline, fn = () => {}}: IProps) => {
    const [time, setTime] = useState(deadline - Date.now())

    useEffect(() => {
        if (deadline - Date.now() < 0) fn()
    }, [time])

    useEffect(() => {
        setTimeout(() => setTime(deadline - Date.now()), 1000) // runs every second
    }, [time])
    
    const content = (
        <span className={styles.timer}>
            {`${Math.floor((time / HOUR) % 24)}`.padStart(2, '0')} : {`${Math.floor((time / MINUTE) % 60)}`.padStart(2, '0')} : {`${Math.floor((time / SECOND) % 60)}`.padStart(2, '0')}
        </span>
    )
    return content
}

export default Timer
