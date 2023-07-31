import { Routes, Route } from "react-router-dom"
// import AllOrders from "./pages/AllOrders"
import LiveOrders from "./pages/LiveOrders"
import OrdersLayout from "./layouts/OrdersLayout"
import LatestOrders from "./pages/LatestOrders"
import AllOrders from "./pages/AllOrders"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { AuthProvider } from "./contexts/auth-context"
import PrivateRoute from "./components/PrivateRoute"
import GlobalLayout from "./layouts/GlobalLayout"
import NotFound from "./pages/NotFound"
// import {PrivateRoute} from "./components/PrivateRoute"

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route element={<GlobalLayout/>}>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute/>}>
          <Route element={<OrdersLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/latest" element={<LatestOrders />} />
            <Route path="/all" element={<AllOrders />} />
          </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App
