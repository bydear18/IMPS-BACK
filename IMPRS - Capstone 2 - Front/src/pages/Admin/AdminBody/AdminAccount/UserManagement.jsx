import './AdminAccount.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [values, setValues] = useState([]);

    const navigate = useNavigate()

    const renderHeader = () => {
        return (
            <div id="userHeader" className="flex">
                <h1>User Management</h1>
            </div>
        );
    };

  const header = renderHeader();

    const handleLogOut = () => {   
        localStorage.setItem("firstName", '');     
        localStorage.setItem("lastName", '');
        localStorage.setItem("email", '');
        localStorage.setItem("userID", '');
        localStorage.setItem("isLoggedIn", '');
        navigate("/");
    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
          },
          };
        
        fetch("http://localhost:8080/services/all", requestOptions).then((response)=> response.json()
        ).then((data) => { setValues(data);})
        .catch(error =>
            {
                console.log(error);
            }
        );
        
    }, []);

    return (
        <div >
              <div id="usersTable" >
              <DataTable value={values} scrollable scrollHeight="28vw" header={header} emptyMessage="No data found."
                  tableStyle={{ minWidth: '20vw' }} selectionMode="single">
                  <Column field="userID" header="userID"></Column>
                  <Column field="lastName" header="Last Name"></Column>
                  <Column field="firstName" header="Name"></Column>
                  <Column field="email" header="Email"></Column>
              </DataTable>
              </div>
              <button id="logOut" onClick={handleLogOut}>Log Out</button>
        </div>
    )
}

export default UserManagement;