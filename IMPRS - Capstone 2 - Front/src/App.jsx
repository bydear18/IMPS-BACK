import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import Adminpage from './pages/Admin/Adminpage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/LoginPage/LoginPage';
import AdminLoginPage from './pages/LoginPage/AdminLoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

const App = () => {
    return (
      <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route exact path="/adminlogin" element={<AdminLoginPage/>} />
          <Route exact path="/register" element={<RegisterPage/>} />
          <Route exact path="/home" element={<Homepage/>} />
          <Route exact path="/admin" element={<Adminpage/>} />
          <Route exact path="/forgotpassword" element={<ForgotPassword/>} />
        </Routes>
      </Router>
    </>
    )
  }
  
  export default App;