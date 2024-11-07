import { createSlice, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

const getStorageItem = (itemName: string) => {
    const item = localStorage.getItem(itemName) || sessionStorage.getItem(itemName) || null
    if (item)
        return JSON.parse(item)

    return null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        user: getStorageItem('auth')?.user || null, 
        token: getStorageItem('auth')?.token || null
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload
            state.user = user
            state.token = token
            sessionStorage.setItem('auth', JSON.stringify({ user: user, token: token }))
        },
        logOut: (state) => {
            state.user = null
            state.token = null
            sessionStorage.removeItem('auth')
            localStorage.removeItem('auth')
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

const selectUser = (state: RootState) => state.auth.user
const selectToken = (state: RootState) => state.auth.token
export const selectAuth = createSelector([selectUser, selectToken], (user, token) => {
    return { user, token }
})
