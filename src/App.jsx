import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./Home";
import Recent from "./Recent";
import Order from "./Order";
import Layout from "./Layout";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected/layout routes */}
        <Route element={<Layout />}>
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/recent" element={<PrivateRoute><Recent /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
