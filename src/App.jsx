import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./Home";
import Recent from "./Recent";
import Order from "./Order";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

        {/* protected/layout routes */}
        
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/recent" element={<PrivateRoute><Recent /></PrivateRoute>} />
        <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
