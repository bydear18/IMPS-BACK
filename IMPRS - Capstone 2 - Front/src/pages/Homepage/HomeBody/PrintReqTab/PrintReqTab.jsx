import './printreq.css';

import React, { useState } from 'react';

import storage from '../../../../firebase';

const PrintReq = () => {
    //Regular Expressions
    const phoneNumber = new RegExp(/^\d{1,11}$/);
    const copies = new RegExp(/^\d{1,4}$/);

    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const infoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
    };

    const closeInfoPop = () => {
        setAlert('hide');
        if (success) {
            window.location.href = '/home';
        }
    };

    const [buttonSubmit, setButtonSubmit] = useState(false);
    const [init, setInit] = useState(true);
    const [disable, setDisable] = useState(true);
    const [bind, setBind] = useState(true);
    const [staple, setStaple] = useState(true);
    const [file, setFile] = useState();
    const [Url, setUrl] = useState('');
    const [requestType, setRequestType] = useState('Select');
    const [noOfCopies, setNoOfCopies] = useState();
    const [colored, setColored] = useState(true);
    const [paperSize, setPaperSize] = useState('Short');
    const [bindType, setBindType] = useState('None');
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState();
    const [requestID, setRequestID] = useState('');
    const userID = localStorage.getItem("userID");
    const email = localStorage.getItem("email");

    //Contact Info
    const name = localStorage.getItem("firstName") + " " +  localStorage.getItem("lastName");
    const [contactNumber, setContactNumber] = useState('');
    const [department, setDepartment] = useState('');

    const [giveExam, setGiveExam] = useState(false);
    const [toStaple, setToStaple] = useState(false);


    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleNumber = (e) => {
        setContactNumber(e.target.value);
        if(!phoneNumber.test(e.target.value)){
            infoPop("Please input a valid phone number!");
            setContactNumber('');
        }
    }

    const handleDepartment = (e) => {
        setDepartment(e.target.value);
    }

    const handleColored = () => {
        switch(colored){
            default:
                setColored(true);
                break;
            case true:
                setColored(false);
                break;
            case false:
                setColored(true);
                break;
        }
    }

    const handleStapled = () => {
        switch(colored){
            default:
                setToStaple(true);
                break;
            case true:
                setToStaple(false);
                break;
            case false:
                setToStaple(true);
                break;
        }
    }

    const handleExam = () => {
        switch(giveExam){
            default:
                setGiveExam(false);
                break;
            case true:
                setGiveExam(false);
                break;
            case false:
                setGiveExam(true);
                break;    
        }
    }

    const handleNoOfCopies = (e) => {
        setNoOfCopies(e.target.value);
        if(!copies.test(e.target.value)){
            infoPop("Please input a proper number of copies!");
            setNoOfCopies('');
        }
    }

    const handlePaperSize = (e) => {
        setPaperSize(e.target.value);
    }

    const handleBindType = (e) => {
        setBindType(e.target.value);
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0,10);;
    }
    
    // Date Values
    const [currentDate, setCurrentDate] = useState(getDate());
    const [useDate, setUseDate] = useState('');

    const upload = () => {
        if(requestType !== 'Select' && contactNumber !== '' && department !== '' && noOfCopies >0 && file!=null && useDate !== '' && description !== ''){
            const data = new FormData();
            data.append('userID', userID);
            data.append('requestID', requestID);
            data.append('fileType', requestType);
            data.append('desc', description);
            data.append('noOfCopies', noOfCopies);
            data.append('colored', colored);
            data.append('stapled', toStaple);
            data.append('giveExam', giveExam);
            data.append('paperSize', paperSize);
            data.append('bindType', bindType);
            data.append('requestDate', currentDate);
            data.append('useDate', useDate);
            data.append('name', name);
            data.append('email', email);
            data.append('contactNumber', contactNumber);
            data.append('department', department);
            
            const commentData = new FormData();
            commentData.append("sentBy", "User");
            commentData.append("header", "Initial Comment");
            commentData.append("content", comment);
            commentData.append("sentDate", currentDate);
            commentData.append("requestID", requestID);
        
            if(file != null){
                setButtonSubmit(true);
            // Sending File to Firebase Storage
            storage.ref(`/files/${file.name}`).put(file)
                .on("state_changed", null, alert, () => {
     
                    // Getting Download Link
                    storage.ref("files")
                        .child(file.name)
                        .getDownloadURL()
                        .then((url) => {
                            setUrl(url);
                            data.append('URL', url);
                            data.append('fileName', file.name); 
    
                            const requestOptions = {
                                method: 'POST',
                                mode: 'cors',
                                body: data
                              };
    
                              fetch("http://localhost:8080/requests/newRequest", requestOptions).then((response) => response.json()
                            ).then((data) => {
                                if (comment != null && comment !== '') {
                                    const requestOptionsComment = {
                                        method: 'POST',
                                        mode: 'cors',
                                        body: commentData
                                    };
                                    fetch("http://localhost:8080/comments/newComment", requestOptionsComment).then((response) => response.json()
                                    ).then((data) => {
                                        console.log(data);
                                    })
                                        .catch(error => {
                                            console.log(error);
                                        }
                                    );
                                }
                                infoPop('Request submitted successfully!', true);
                            })
                                .catch(error => {
                                    console.log(error);
                                }
                            );
                        })
                });
        }
    } else {
        infoPop('Please make sure that you attached a file, and filled out all the fields!');
    }
};

    const disableIn = (value) => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
        },
        };

        var tag = '';

        if (value === 'Module'){
            setRequestType('Module');
            tag = "MD0";
        }else if (value === 'Office'){
            setRequestType('Office Form');
            tag = "OF0";
        }else if (value === 'Exam'){
            setRequestType('Exam');
            tag = "EX0";
        }else if (value === 'Manual'){
            setRequestType('Manual');
            tag = "MA0";
        }

        if(value !== 'Select'){
        fetch("http://localhost:8080/records/generateid?fileType=" + value, requestOptions).then((response)=> response.json()
        ).then((data) => { setRequestID(tag + (data+1).toString());})
        .catch(error =>
        {
            console.log(error);
        });
        }else{
            setRequestID("");
        }

        

        switch(value){
            default:{
                break;
            }
            case 'Module':{
                setRequestType('Module');
                setDisable(true);
                setStaple(true);
                setBind(false);
                setInit(false);
                break;
            }
            case 'Manual':{
                setRequestType('Manual');
                setDisable(true);
                setStaple(true);
                setBind(false);
                setInit(false);
                break;
            }
            case 'Exam':{
                setRequestType('Exam');
                setDisable(false);
                setBind(true);
                setStaple(true);
                setInit(false);
                break;
            }
            case 'Office':{
                setRequestType('Office');
                setDisable(true);
                setStaple(false);
                setBind(false);
                setInit(false);
                break;
            }
            case 'Select':{
                setInit(true);
            }
        }        
    }

    return (
            
        <div id="reqContainer">
            <div id="infoPopOverlay" className ={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
            </div>
            <h1 id='printReqHead'>PRINT REQUEST FORM</h1>
                <h2 id='reqNum'> Request#: {requestID}</h2>
                
                <div id="formBody">
                    <div className="reqLabel" >Request Type:</div>
                        <select id="reqType" onChange={(e) => disableIn(e.target.value)}> 
                            <option value='Select' >Select</option>
                            <option value="Module" >Module</option>
                            <option value="Manual" >Manual</option>
                            <option value="Exam" >Examination</option>
                            <option value="Office" >Office Form</option>
                        </select>

                
                <div className='fileDeet'>File Details</div>
                    <div id="upload">File Name:</div>
                        <input type= "file" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="fileinput"
                        onChange={handleFile} disabled={init}/>
                    {/* <div className='fileDescL'>File Description:</div> */}
                        <textarea className='fileDesc' wrap="soft" placeholder="File Description" disabled={init} value={description} onChange={(e) => {setDescription(e.target.value)}}/>
                    <div className='givePerson'>Give examination file personally:</div>
                        <input className='giveExam' type='checkbox' onChange={handleExam} disabled={disable || init}/>


                    <div className='contactInfo'>Contact Information</div>
                        {/* <div className='namePR'>Name:</div> */}
                            <input className='nameText' wrap='soft' placeholder="Name" value ={name} disabled='true'/>
                        {/* <div className='emailPR'>Email:</div> */}
                            <input className='emailText' wrap='soft' placeholder="Email" value = {email} disabled='true'/>
                        {/* <div className='numberPR'>Phone Number:</div> */}
                            <input className='numberText' wrap='soft' type='text' placeholder="Contact Number" disabled={init} value={contactNumber} onChange={handleNumber}/>
                        {/* <div className='departmentPR'>Department:</div> */}
                            <input className='departmentText' wrap='soft' placeholder="Department"  disabled={init} onChange={handleDepartment}/>


                <div className='comments'>Additional Comments/Instructions</div>
                    <textarea className='commentBox' wrap='soft' placeholder="Comments/Instructions" value={comment} disabled={init} onChange={handleComment}/>
                </div>

                <div className='dateBox'>
                <div className='dateInfo'>Dates</div>
                    <div className="reqDateL">Request Date:</div>
                        <input className='reqDate' type="date" value={currentDate} disabled="true"/>
                    <div className="needDateL">Date Needed:</div>
                        <input className='needDate' type="date" disabled={init} onChange={(e) => {setUseDate(e.target.value)}}/>
                </div>

                <div className='printBox'>
                <div className='printInfo'>Print Specifications</div>
                    <input className='copyNum' type='number' placeholder="# of Copies" min='0' value={noOfCopies} disabled={init} onChange={handleNoOfCopies}/>
                        <div className='color'>Colored:</div>
                            <input className='colorBox' type='checkbox' checked={colored} disabled={init} onChange={handleColored}/>
                        <div className="paperSizeL">Paper Size:</div>
                            <select id="paperType" defaultValue={paperSize} disabled={init} onChange={handlePaperSize}>
                                <option value="Short">Short</option>
                                <option value="Long">Long</option>
                                <option value="A4">A4</option>
                                <option value="Other">Other</option>
                            </select>
                        <div className='staple' >Stapled?</div>
                            <input className='stapleBox' type='checkbox' disabled={staple || init} onChange={handleStapled}/>
                        <div className="bind">Bind:</div>
                            <select id="bindType" onChange={handleBindType} disabled={bind || init}>
                                <option value="None">None</option>
                                <option value="Softbound">Softbound</option>
                                <option value="Hardbound">Hardbound</option>
                                <option value="Ringbound">Ringbound</option>
                            </select>
                </div>

                        <button className='submit' disabled={buttonSubmit} onClick={upload}>Submit</button>
        </div>
    );
};

export default PrintReq;