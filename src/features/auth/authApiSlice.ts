import { apiSlice } from '../../app/api/apiSlice'
import { setCredentials, logOut } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials }
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { user, token } = data
                    dispatch(setCredentials({ user, token }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        sendLogout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                }
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation
} = authApiSlice
