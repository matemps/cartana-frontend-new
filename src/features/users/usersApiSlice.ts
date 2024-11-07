import { apiSlice } from '../../app/api/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        addNewUser: builder.mutation({
            query: (credentials) => ({
                url: '/users',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 201 && !result.isError
                }
            })
        })
    })
})

export const { useAddNewUserMutation } = usersApiSlice
