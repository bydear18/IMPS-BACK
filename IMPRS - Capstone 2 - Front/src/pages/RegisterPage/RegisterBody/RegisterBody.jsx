import './registerbody.css';

import React, { useState } from 'react';

import {
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const RegisterBody = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const infoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
    }

    const closeInfoPop = () => {
      setAlert('hide');
      if (success) {
        navigate('/'); // Redirect to sign-in page on success
      }
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate()

    const handleRegister = () => {
      const requestOptionsGET = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
      },
      };

      const requestOptions = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
        },
        };
      if(confirmPass === password){
        if (email.match(isValidEmail)){
          fetch("http://localhost:8080/services/exists?email=" + email, requestOptionsGET).then((response)=> response.json()
            ).then((data) => {
              if(data===true){
                infoPop('That email is already in use! Please use another email.');
              }else{
                fetch("http://localhost:8080/services/NewUserRegistration?firstName=" + firstName + "&lastName=" + lastName + "&password=" + password + "&email=" + email, requestOptions).then((response)=> response.json()
                  ).then((data) => {
                    navigate('/');
                  })
                  .catch(error =>
                    {
                        console.log(error);
                    }
                );
              }
          })
            .catch(error =>
              {
                  console.log(error);
              }
          );
            setFirstName('');
            setLastName('');
            setPassword('');
            setEmail('');
            setConfirmPass('');

        }else{
          infoPop('Please input a valid email.');
        }  
      }else{
          infoPop('Make sure your passwords match! Try again.');
      }
      
    }

const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  
    return (
    <div class='main section'>
      <div id="infoPopOverlay" className ={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
            </div>
     
      <div class='title'>
      </div>
      <div id="regLogCon">
        <h2>Registration</h2>
          <form id="loginForm">
          <label>
              <FaUser />
              <input
                className='regShad'
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </label>
            <label>
              <input
                className='regInput regShad'
                required
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </label>
            <hr className='regLine'/>
            <label>
              <HiAtSymbol id='emailSym' />
              <input
                className='regShad'
                id='emailIn'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </label>
            <hr className='regLine'/>
            <label>
              <FaLock />
              <input
                className='regShad'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>
            <label>
              <input
                className='regInput regShad'
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
                
              />
            </label>

            <div class="buttons">
                <button className='login-btn' type="button" onClick={handleRegister}>
                Register
                </button>
            </div>
            
            <div className='aregistered'>
              <p id="regQues">ALREADY REGISTERED? </p>
            </div>
            <a id="signIn" href='/'> Sign In</a>
          </form>
      </div>
      <div className='cit-bglogo'></div>



    </div>

    
    )
};

export default RegisterBody;