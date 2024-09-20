import './hometab.css';

import React, {
  useEffect,
  useState,
} from 'react';

const Hometab = () => {
    const [tab1, setTab1] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab2, setTab2] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab3, setTab3] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab4, setTab4] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [tab5, setTab5] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    const [toggleState, setToggleState] = useState(1);
    const [headerName, setHeaderName] = useState('Listen Here!');
    const [adminEdit, setAdminEdit] = useState('hide');
    const [blocked, setBlocked] = useState(true);
    const [buttonText,setButtonText] = useState('Edit');
    const [editing, setEditing] = useState(false);

    const changeHeader = (header) => {
        setHeaderName(header);
    }

    const toggleTab = (index) => {
        setToggleState(index);
    }

    const handleEdit=()=>{
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
          },
          };

        if(editing===false){
            setEditing(true);
            setBlocked(false);
            setButtonText('Done');
        }else if(editing===true){
            fetch("http://localhost:8080/services/createHome?ann=" + tab1 + "&guide=" + tab2 + "&loc=" + tab4 + "&pro=" + tab3 + "&upd=" + tab5, requestOptions).then((response)=> response.json()
            ).then((data) => {
                setEditing(false);
                setBlocked(true);
                setButtonText('Edit');
            })
            .catch(error =>
                {
                    console.log(error);
                }
            );
        }
    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
          },
          };
          fetch("http://localhost:8080/services/checkAdmin?email=" + localStorage.getItem("email"), requestOptions).then((response)=> response.json()
        ).then((data) => {
            if(data===true){
                setAdminEdit('show');
            }else{
                setAdminEdit('hide');
            }
        })
        .catch(error =>
            {
                console.log(error);
            }
        );
        if(editing===false){
            fetch("http://localhost:8080/services/getHomeNumber", requestOptions).then((response)=> response.json()
        ).then((data) => {
            if(data>=1){
                fetch("http://localhost:8080/services/getHome", requestOptions).then((response)=> response.json()
                ).then((data) => {
                    setTab1(data['announcements']);
                    setTab2(data['guidelines']);
                    setTab3(data['process']);
                    setTab4(data['locations']);
                    setTab5(data['updates']);
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
        }
    });

    return (
    <div id='homeBox'>
        <div id='tabCont'>
            <div className={toggleState === 1 ? "Htab Hactive-tab" : "Htab"} onClick={() => {toggleTab(1); changeHeader('Listen Here!')}}>Announcements</div>
            <div className={toggleState === 2 ? "Htab Hactive-tab" : "Htab"} onClick={() => {toggleTab(2); changeHeader('Guidelines')}}>Guidelines</div>
            <div className={toggleState === 3 ? "Htab Hactive-tab" : "Htab"} onClick={() => {toggleTab(3); changeHeader('Claiming Process')}}>Claiming Process</div>
            <div className={toggleState === 4 ? "Htab Hactive-tab" : "Htab"} onClick={() => {toggleTab(4); changeHeader('Where to Claim?')}}>Locations</div>
            <div className={toggleState === 5 ? "Htab Hactive-tab" : "Htab"} onClick={() => {toggleTab(5); changeHeader("What's New?")}}>Updates</div>
        </div>

        <div className="Hcontentpos">
            <div id = "adminHomeHeader">
            <h1>{headerName}</h1><button id="adminEdit" className={adminEdit} onClick={handleEdit}>{buttonText}</button>
            </div>
            <hr />
            <div className={toggleState === 1 ? "active-Hcontent" : "Hcontent"} onClick={() => {toggleTab(1)}}>
            <textarea
            value={tab1}
            disabled={blocked} onChange={(e)=>{setTab1(e.target.value)}} className='homeText'/>
            </div>

            <div className={toggleState === 2 ? "active-Hcontent" : "Hcontent"} onClick={() => {toggleTab(2)}}>
            <textarea
            value={tab2}
            disabled={blocked} onChange={(e)=>{setTab2(e.target.value)}} className='homeText'/>
            </div>

            <div className={toggleState === 3 ? "active-Hcontent" : "Hcontent"} onClick={() => {toggleTab(3)}}>
            <textarea
            value={tab3}
            disabled={blocked} onChange={(e)=>{setTab3(e.target.value)}} className='homeText'/>
            </div>

            <div className={toggleState === 4 ? "active-Hcontent" : "Hcontent"} onClick={() => {toggleTab(4)}}>
            <textarea
            value={tab4}
            disabled={blocked} onChange={(e)=>{setTab4(e.target.value)}} className='homeText'/>
            </div>

            <div className={toggleState === 5 ? "active-Hcontent" : "Hcontent"} onClick={() => {toggleTab(5)}}>
            <textarea
            value={tab5}
            disabled={blocked} onChange={(e)=>{setTab5(e.target.value)}} className='homeText'/>
            </div>
        </div>
    </div>

    )
}

export default Hometab;