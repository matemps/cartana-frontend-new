import { apiSlice } from '../../app/api/apiSlice'

type createTransactionParams = { car_id: number, state: string, city: string, zip: string, address: string, payment: string, acctType: string, accountFName: string, accountLName: string, accountNumber: string, routing: string }
    | { car_id: number, state: string, city: string, zip: string, address: string, payment: string, cardFName: string, cardLName: string, cardNumber: string, exp: string, cvv: string }
type transaction = { id: number, car_id: number, state: string, city: string, zip: string, address: string, payment: string, acctType: string, accountFName: string, accountLName: string, accountNumber: string, routing: string }
    | { id: number, car_id: number, state: string, city: string, zip: string, address: string, payment: string, cardFName: string, cardLName: string, cardNumber: string, exp: string, cvv: string }

export const transactionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTransactions: builder.query<Array<transaction>, void>({
            query: () => ({
                url: '/transactions',
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getTransactionById: builder.query<transaction, number>({
            query: (transaction_id) => ({
                url: `/transactions/${transaction_id}`,
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        createTransaction: builder.mutation<transaction, createTransactionParams>({
            query: (params) => ({
                url: '/transactions',
                method: 'POST',
                body: { ...params },
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 201 && !result.isError
                }
            }),
            invalidatesTags: [{ type: 'cars', id: 'LIST' }]
        })
    })
})

export const { 
    useGetTransactionsQuery,
    useGetTransactionByIdQuery,
    useCreateTransactionMutation
} = transactionsApiSlice
