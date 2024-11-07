import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut } from '../../features/auth/authSlice'
import type { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token

        if (token) headers.set('authorization', `Bearer ${token}`)

        return headers;
    }
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)

    const token = api.getState().auth.token

    if (result?.error?.status === 401 && token) // personal access token has expired but user is still logged in with that token
        api.dispatch(logOut())

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['cars'],
    endpoints: () => ({})
})
