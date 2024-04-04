import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {

     const [data, setData] = useState([]);

     const user = JSON.parse(localStorage.getItem('user'));

     const patientid = user.id;

     useEffect(() => {
          // fetch("http://localhost:9190/patient/doctors", {
          //      method: "GET", // *GET, POST, PUT, DELETE, etc.
          //      // mode: "cors", // no-cors, *cors, same-origin
          //      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          //      credentials: "same-origin", // include, *same-origin, omit
          //      headers: {
          //           "Content-Type": "application/json",
          //           "Accept": "application/json"
          //           // 'Content-Type': 'application/x-www-form-urlencoded',
          //      },
          //      redirect: "follow", // manual, *follow, error
          // })
          // .then((res) => { console.log(res) })
          
          axios.get("http://localhost:9190/patient/doctors",{
               headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
               }
          })
               .then((res) => {
                    console.log(res);
                    // console.log(JSON.parse(res));
                    setData(res.data);
               })
               .catch((err) => { console.log(err) });
     }, []);


     const handleClick = (doctorid) => {
          // console.log("userid: ",user.id);
          // console.log("doctorid: ",doctorid);

          axios.post("http://localhost:9190/appointment/makeAppointment",
               {
                    "roomId": roomID,
                    "doctor": {
                         "id": doctorid
                    },
                    "patient": {
                         "id": patientid
                    }
               })
               .then((res) => {
                    console.log(res);
               })
               .catch((res) => {
                    console.log(res);
               })
     }



     function randomID(len) {
          let result = '';
          if (result) return result;
          var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
               maxPos = chars.length,
               i;
          len = len || 5;
          for (i = 0; i < len; i++) {
               result += chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return result;
     }

     function getUrlParams(
          url = window.location.href
     ) {
          let urlStr = url.split('?')[1];
          return new URLSearchParams(urlStr);
     }


     const roomID = getUrlParams().get('roomID') || randomID(5);

     console.log(roomID);




     return (
          <div>
               <div>Hi! {user.name}. This is your dashboard</div>

               {data.map((doctor, index) => {
                    return <div key={index} className='doctors'><h4>{doctor.name}</h4><Link to="/video-call-patient" onClick={() => { handleClick(doctor.id) }} state={{ caller: user.id, callee: doctor.id }}>Call</Link></div>

               })}

          </div>
     )
}

export default PatientDashboard