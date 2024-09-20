import React, {
  useEffect,
  useState,
} from 'react';

import {
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const navigate = useNavigate()

    const infoPop =(message) => {
        setAlert('show');
        setAlertMsg(message);
    }

    const closeInfoPop = () => {
      setAlert('hide');
    }

  const handleLogin = () => {
    localStorage.setItem("email", email);
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
    },
    };
        fetch("http://localhost:8080/services/userLogin?email=" + email + "&password=" + password, requestOptions).then((response)=> response.json()
        ).then((data) => {
          if(data['message'] === 'User login'){
            fetch("http://localhost:8080/services/getname?email=" + email, requestOptions).then((response)=> response.json()
            ).then((data) => {
              localStorage.setItem("firstName", data['firstName']);
              localStorage.setItem("lastName", data['lastName']);
              fetch("http://localhost:8080/services/getid?email=" + email, requestOptions).then((response)=> response.json()
              ).then((data) => {
                localStorage.setItem("userID", data['userID']);
                localStorage.setItem("isLoggedIn", true);
                navigate('/home');
              })
              .catch(error => {
                  console.log(error);
              });
            })
            .catch(error => {
                console.log(error);
            });

            
          }else{
            infoPop('There is no account that matches those credentials. Please register.');
          }
          console.log(data)})
          .catch(error =>
            {
                console.log(error);
            }
        );
        
  };
  
  const handleAdminLogin = () => {
    navigate('/adminlogin');
  }

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };
  
  const handleRegister = () => {
    navigate("/register");
  }

  useEffect(() => {
    if(localStorage.getItem("isLoggedIn")==="true"){
        navigate("/home");
    }
  });

    return (
    <div class='main section'>
      <div id="infoPopOverlay" className ={alert}></div>
      <div id="infoPop" className={alert}>
          <p>{alertMsg}</p>
          <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
        </div>
      <div class='title'>
        <h1>INSTRUCTIONAL MATERIAL PRINTING REQUEST</h1>
      </div>
      <div class='login-container'>
        <h2>User Authentication</h2>
        {isLoggedIn ? (
          <p>You are logged in!</p>
        ) : (
          <form id="loginForm">
            <label>
              <FaUser />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </label>
            <label>
              <FaLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>

            <div class="buttons">
                <button className='login-btn' type="button" onClick={handleLogin}>
                Login
                </button>
                <button className='clear-btn' type="button" onClick={handleClear}>
                Clear Entities
                </button>
                <button className='register-btn' onClick={handleRegister}>Register</button>
            </div>
            
            <div className='fpass'>
              <p>Forgot Password? <a href="/forgotpassword"> Click Here</a></p>
            </div>
          </form>
        )}
        
      </div>
      <div className='cit-bglogo'></div>

        <button id='adminLogin' onClick={handleAdminLogin}>Login as Admin</button>
        
    </div>

    
    )
};

export default Login;
