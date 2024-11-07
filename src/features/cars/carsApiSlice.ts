import { apiSlice } from '../../app/api/apiSlice'

type car = { id: number, vin: string, year: number, model: string, manufacturer: string, series?: string, trim?: string, cond: number, price: number, description: string, cylinders: number, fuel: string, odo: number, drivetrain: string, transmission?: string, body: string, color: string, doors: number, seats: number, type: string }
type searchCarsResult = { cars: Array<car>, count: number }
type carSearchQuery = { start: number, count: number, manufacturer?: string, model?: string, body?: string, color?: string, priceMin: number, priceMax: number, odoMin: number, odoMax: number, yearMin: number, yearMax: number }
type reservation = { id: number, car_id: number, user_id: number, exp_time: string } | { message: string }

export const carsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        searchCars: builder.query<searchCarsResult, carSearchQuery>({
            query: (params) => ({
                url: '/cars',
                params: { ...params },
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            }),
            providesTags: (result) =>
                result
                ? [
                    ...result.cars.map(({id}) => ({ type: 'cars' as const, id })),
                    { type: 'cars', id: 'LIST' },
                ]
                : [{ type: 'cars', id: 'LIST' }],
        }),
        getCarByCarId: builder.query<car, number>({
            query: (carId) => ({
                url: `/cars/${carId}`,
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getMakes: builder.query<Array<string>, void>({
            query: () => ({
                url: '/cars/makes',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getModels: builder.query<Array<string>, void>({
            query: () => ({
                url: '/cars/models',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getBodies: builder.query<Array<string>, void>({
            query: () => ({
                url: '/cars/bodies',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getColors: builder.query<Array<string>, void>({
            query: () => ({
                url: '/cars/colors',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                }
            })
        }),
        getReservationStatus: builder.query<Array<number | reservation | undefined>, number>({
            query: (car_id) => ({
                url: '/reservations',
                params: { car_id },
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return (response.status === 200 || response.status === 404) && !result.isError
                }
            }),
            transformResponse: (response: reservation, meta) => {
                return [meta?.response?.status, response]
            }
        }),
        setCarReservation: builder.mutation({
            query: (params) => ({
                url: '/reservations',
                method: 'POST',
                body: { ...params },
                headers: {
                    'accept': 'application/json'
                },
                validateStatus: (response: Response, result: any) => {
                    return (response.status === 200 || response.status === 201) && !result.isError
                }
            })
        })
    })
})

export const {
    useSearchCarsQuery,
    useGetCarByCarIdQuery,
    useGetMakesQuery,
    useGetModelsQuery,
    useGetBodiesQuery,
    useGetColorsQuery,
    useGetReservationStatusQuery,
    useSetCarReservationMutation
} = carsApiSlice
