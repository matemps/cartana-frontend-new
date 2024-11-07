import useTitle from '../../hooks/useTitle'
import { useGetMakesQuery, useGetModelsQuery, useGetBodiesQuery, useGetColorsQuery, useSearchCarsQuery } from './carsApiSlice'
import { PulseLoader } from 'react-spinners'
import { useRef, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import styles from './CarSearch.module.css'

const CarSearch = () => {
    useTitle('Car Search')

    let errs : Array<string> = []
    
    const [errFields, setErrFields] = useState(Array<string>)
    
    const [make, setMake] = useState('all')
    const [model, setModel] = useState('all')
    const [body, setBody] = useState('all')
    const [color, setColor] = useState('all')
    const [priceMin, setPriceMin] = useState(0)
    const [priceMax, setPriceMax] = useState(1000000)
    const [odoMin, setOdoMin] = useState(0)
    const [odoMax, setOdoMax] = useState(1000000)
    const [yearMin, setYearMin] = useState(1985)
    const [yearMax, setYearMax] = useState(2021)

    const [page, setPage] = useState(0)
    const carsPerPage = 25

    type carSearchQuery = { start: number, count: number, manufacturer?: string, model?: string, body?: string, color?: string, priceMin: number, priceMax: number, odoMin: number, odoMax: number, yearMin: number, yearMax: number }
    let query : carSearchQuery = { start: page * carsPerPage, count: carsPerPage, manufacturer: make, model, body, color, priceMin, priceMax, odoMin, odoMax, yearMin, yearMax }
    if (make === 'all') delete query.manufacturer
    if (model === 'all') delete query.model
    if (body === 'all') delete query.body
    if (color === 'all') delete query.color

    const makeRef = useRef<HTMLSelectElement>(null)
    const modelRef = useRef<HTMLSelectElement>(null)
    const bodyRef = useRef<HTMLSelectElement>(null)
    const colorRef = useRef<HTMLSelectElement>(null)
    const priceMinRef = useRef<HTMLInputElement>(null)
    const priceMaxRef = useRef<HTMLInputElement>(null)
    const odoMinRef = useRef<HTMLInputElement>(null)
    const odoMaxRef = useRef<HTMLInputElement>(null)
    const yearMinRef = useRef<HTMLInputElement>(null)
    const yearMaxRef = useRef<HTMLInputElement>(null)

    const {
        data: makes,
        isLoading: isLoadingMakes,
        isSuccess: isSuccessMakes,
        error: makesError
    } = useGetMakesQuery()

    if (makesError) {
        const err = 'status' in makesError
            ? 'error' in makesError
                ? makesError.error
                : JSON.stringify(makesError.data)
            : makesError.message
        
        if (err) errs.push(err)
    }

    const {
        data: models,
        isLoading: isLoadingModels,
        isSuccess: isSuccessModels,
        error: modelsError
    } = useGetModelsQuery()

    if (modelsError) {
        const err = 'status' in modelsError
            ? 'error' in modelsError
                ? modelsError.error
                : JSON.stringify(modelsError.data)
            : modelsError.message
        
        if (err) errs.push(err)
    }

    const {
        data: bodies,
        isLoading: isLoadingBodies,
        isSuccess: isSuccessBodies,
        error: bodiesError
    } = useGetBodiesQuery()

    if (bodiesError) {
        const err = 'status' in bodiesError
            ? 'error' in bodiesError
                ? bodiesError.error
                : JSON.stringify(bodiesError.data)
            : bodiesError.message
        
        if (err) errs.push(err)
    }

    const {
        data: colors,
        isLoading: isLoadingColors,
        isSuccess: isSuccessColors,
        error: colorsError
    } = useGetColorsQuery()

    if (colorsError) {
        const err = 'status' in colorsError
            ? 'error' in colorsError
                ? colorsError.error
                : JSON.stringify(colorsError.data)
            : colorsError.message
        
        if (err) errs.push(err)
    }
    
    const {
        data: cars,
        isLoading: isLoadingCars,
        isSuccess: isSuccessCars,
        error: carsError
    } = useSearchCarsQuery(query)

    if (carsError) {
        const err = 'status' in carsError
            ? 'error' in carsError
                ? carsError.error
                : JSON.stringify(carsError.data)
            : carsError.message
        
        if (err) errs.push(err)
    }

    let context
    if (isLoadingMakes || isLoadingModels || isLoadingBodies || isLoadingColors || isLoadingCars)
        context = <PulseLoader />
    else if (errs.length) {
        const errorsJSX = errs.map((err, i) => {
            return <p className="errmsg" key={i}>{err}</p>
        })
        context = (
            <div>
                {errorsJSX}
            </div>
        )
    }
    else if (isSuccessMakes && isSuccessModels && isSuccessBodies && isSuccessColors && isSuccessCars) {
        const handleSubmit = (e: React.SyntheticEvent) => {
            e.preventDefault()

            let errors = []

            if (makeRef?.current?.value)
                if (!makes.includes(makeRef.current.value) && makeRef.current.value !== 'all') errors.push(`No make with value: ${makeRef.current.value}`)
            if (modelRef?.current?.value)
                if (!models.includes(modelRef.current.value) && modelRef.current.value !== 'all') errors.push(`No model with value: ${modelRef.current.value}`)
            if (bodyRef?.current?.value)
                if (!bodies.includes(bodyRef.current.value) && bodyRef.current.value !== 'all') errors.push(`No body with value: ${bodyRef.current.value}`)
            if (colorRef?.current?.value)
                if (!colors.includes(colorRef.current.value) && colorRef.current.value !== 'all') errors.push(`No color with value: ${colorRef.current.value}`)

            if (priceMinRef?.current?.value) {
                if (isNaN(Number(priceMinRef.current.value))) errors.push('Invalid minimum price format')
                else if (Number(priceMinRef.current.value) < 0) errors.push('Minimum price cannot be less than 0.')
                else if (Number(priceMinRef.current.value) > 1000000) errors.push('Minimum price cannot be more than 1000000.')
            }
            
            if (priceMaxRef?.current?.value) {
                if (isNaN(Number(priceMaxRef.current.value))) errors.push('Invalid maximum price format')
                else if (Number(priceMaxRef.current.value) < 0) errors.push('Maximum price cannot be less than 0.')
                else if (Number(priceMaxRef.current.value) > 1000000) errors.push('Maximum price cannot be more than 1000000.')
            }

            if (odoMinRef?.current?.value) {
                if (isNaN(Number(odoMinRef.current.value))) errors.push('Invalid minimum mileage format')
                else if (Number(odoMinRef.current.value) < 0) errors.push('Minimum mileage cannot be less than 0.')
                else if (Number(odoMinRef.current.value) > 1000000) errors.push('Minimum mileage cannot be more than 1000000.')
            }

            if (odoMaxRef?.current?.value) {
                if (isNaN(Number(odoMaxRef.current.value))) errors.push('Invalid maximum mileage format')
                else if (Number(odoMaxRef.current.value) < 0) errors.push('Maximum mileage cannot be less than 0.')
                else if (Number(odoMaxRef.current.value) > 1000000) errors.push('Maximum mileage cannot be more than 1000000.')
            }

            if (yearMinRef?.current?.value) {
                if (isNaN(Number(yearMinRef.current.value))) errors.push('Invalid minimum year format')
                else if (Number(yearMinRef.current.value) < 1985) errors.push('Minimum year cannot be less than 1985.')
                else if (Number(yearMinRef.current.value) > 2021) errors.push('Minimum year cannot be more than 2021.')
            }

            if (yearMaxRef?.current?.value) {
                if (isNaN(Number(yearMaxRef.current.value))) errors.push('Invalid maximum year format')
                else if (Number(yearMaxRef.current.value) < 1985) errors.push('Maximum year cannot be less than 1985.')
                else if (Number(yearMaxRef.current.value) > 2021) errors.push('Maximum year cannot be more than 2021.')
            }

            if (!errors.length) {
                if (makeRef?.current?.value)
                    setMake(makeRef.current.value)
                if (modelRef?.current?.value)
                    setModel(modelRef.current.value)
                if (bodyRef?.current?.value)
                    setBody(bodyRef.current.value)
                if (colorRef?.current?.value)
                    setColor(colorRef.current.value)
                if (priceMinRef?.current?.value)
                    setPriceMin(Number(priceMinRef.current.value))
                if (priceMaxRef?.current?.value)
                    setPriceMax(Number(priceMaxRef.current.value))
                if (odoMinRef?.current?.value)
                    setOdoMin(Number(odoMinRef.current.value))
                if (odoMaxRef?.current?.value)
                    setOdoMax(Number(odoMaxRef.current.value))
                if (yearMinRef?.current?.value)
                    setYearMin(Number(yearMinRef.current.value))
                if (yearMaxRef?.current?.value)
                    setYearMax(Number(yearMaxRef.current.value))
                
                setPage(0)
            }
            setErrFields(errors)
        }

        let carsSearchResultContext = (
            <div>
                <p>No Cars Found.</p>
            </div>
        )
        if (cars['cars']?.length) {
            const pageCount = Math.ceil(cars['count'] / carsPerPage)
            const carsSearchContent = cars['cars'].map((car) => (
                <li key={car.id}>
                    <Link className={styles.car} style={{ display: 'block', width: 'fit-content' }} to={`/cars/${car.id}`}>
                        <h3>{car.year} {car.manufacturer} {car.model}</h3>
                        <div>
                            <p><b>Price:</b> ${car.price}</p>
                            <p><b>Mileage:</b> {car.odo}</p>
                            <p><b>Color:</b> {car.color}</p>
                        </div>
                    </Link>
                </li>
            ))
            carsSearchResultContext = (
                <div>
                    <ul className={styles.results}>
                        {carsSearchContent}
                    </ul>
                    <ReactPaginate
                        containerClassName={styles.pagination}
                        previousLabel="<"
                        nextLabel=">"
                        pageClassName={styles.pageItem}
                        pageLinkClassName={styles.pageItem}
                        previousClassName={styles.pageItem}
                        previousLinkClassName={styles.pageItem}
                        nextClassName={styles.pageItem}
                        nextLinkClassName={styles.pageItem}
                        breakLabel="..."
                        breakClassName={styles.pageItem}
                        breakLinkClassName={styles.pageItem}
                        initialPage={page}
                        onPageChange={(e) => setPage(e.selected)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={9}
                        pageCount={pageCount}
                        renderOnZeroPageCount={null}
                    />
                </div>
            )
        }

        const errFieldsContext = errFields.length
        ? errFields.map((err, i) => {
            return (
                <li key={i}>
                    <p className="errmsg">{err}</p>
                </li>
            )
        })
        : null

        const errFieldsClass = errFields.length ? styles.errFields : "offscreen";

        context = (
            <>
                <form className={styles.carSearchForm} onSubmit={handleSubmit}>
                    <div className={errFieldsClass}>
                        <ul>
                            {errFieldsContext}
                        </ul>
                    </div>
                    <div className={styles.search}>
                        <div>
                            <div>
                                <label htmlFor="make_search">Make: </label>
                                <select id="make_search" defaultValue={make} ref={makeRef}>
                                    <option value="all">Any</option>
                                    {makes.map((make) => (
                                        <option key={make} value={make}>{make}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="model_search">Model: </label>
                                <select id="model_search" defaultValue={model} ref={modelRef}>
                                    <option value="all">Any</option>
                                    {models.map((model) => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="body_search">Body: </label>
                                <select id="body_search" defaultValue={body} ref={bodyRef}>
                                    <option value="all">Any</option>
                                    {bodies.map((body) => (
                                        <option key={body} value={body}>{body}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="color_search">Color: </label>
                                <select id="color_search" defaultValue={color} ref={colorRef}>
                                    <option value="all">Any</option>
                                    {colors.map((color) => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <label htmlFor="priceMin">Min. Price: </label>
                                    <input type="number" min={0} max={1000000} id="priceMin" ref={priceMinRef} defaultValue={priceMin} />
                                </div>
                                <div>
                                    <label htmlFor="priceMax">Max. Price: </label>
                                    <input type="number" min={0} max={1000000} id="priceMax" ref={priceMaxRef} defaultValue={priceMax} />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="odoMin">Min. Mileage: </label>
                                    <input type="number" min={0} max={1000000} id="odoMin" ref={odoMinRef} defaultValue={odoMin} />
                                </div>
                                <div>
                                    <label htmlFor="odoMax">Max. Mileage: </label>
                                    <input type="number" min={0} max={1000000} id="odoMax" ref={odoMaxRef} defaultValue={odoMax} />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="yearMin">Min. Year: </label>
                                    <input type="number" min={1985} max={2021} id="yearMin" ref={yearMinRef} defaultValue={yearMin} />
                                </div>
                                <div>
                                    <label htmlFor="yearMax">Max. Year: </label>
                                    <input type="number" min={1985} max={2021} id="yearMax" ref={yearMaxRef} defaultValue={yearMax} />
                                </div>
                            </div>
                        </div>
                        <button className={styles.submit} type="submit">Search</button>
                    </div>
                </form>

                {carsSearchResultContext}
            </>
        )
    }

    const content = (
        <section>
            <header className={styles.header}>
                <h1>Car Search</h1>
            </header>
            {context}
        </section>
    )
    return content
}

export default CarSearch
