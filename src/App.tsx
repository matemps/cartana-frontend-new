import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './features/auth/Login'
import LogOut from './features/auth/LogOut'
import RequireAuth from './features/auth/RequireAuth'
import NewUserForm from './features/users/NewUserForm'
import CarSearch from './features/cars/CarSearch'
import CarView from './features/cars/CarView'
import PurchaseCar from './features/cars/PurchaseCar'
import Transactions from './features/transactions/Transactions'
import TransactionView from './features/transactions/TransactionView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* navigate to cars search page if we're at the index */}
        <Route index element={<Navigate to="/cars" replace />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="cars/:carId/purchase" element={<PurchaseCar />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:transactionId" element={<TransactionView />} />
        </Route>

        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="/logout" element={<LogOut />}/>
        <Route path="register" element={<NewUserForm />} />
        <Route path="cars/:carId" element={<CarView />} />
        <Route path="cars" element={<CarSearch />} />
      </Route>
    </Routes>
  )
}

export default App
