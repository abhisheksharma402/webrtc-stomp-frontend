import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useRef } from 'react';


const DoctorDashboard = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user.id;
  const [appointments, setAppointments] = useState([]);
  const [remoteID, setRemoteId] = useState('');
  const [localID, setLocalId] = useState(doctorId);
  const [incomingCall, setIncomingCall] = useState(false);
  const [roomID, setRoomID] = useState("");
  let stompClient = useRef();

  let localVideoRef = useRef();
  let remoteVideoRef = useRef();

  const navigate = useNavigate()


  const getAppointments = () => {
    axios.get("http://localhost:9190/doctor/appointments", { params: { doctorId: doctorId } })
      .then((res) => {
        console.log(res.data);
        setAppointments(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const handleAcceptCall = () => {
    const newUuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );

    console.log(newUuid);

    setRoomID(newUuid);

    stompClient.current.send("/app/acceptCall", {}, JSON.stringify({
      "roomID": newUuid,
      "acceptedBy": localID.toString(),
      "initiatedBy": remoteID.toString()
    }));

    navigate(`/room/${newUuid}`, { state: { callee: remoteID, caller: localID } });


  }


  useEffect(() => {

    var configuration = {
      iceServers: [{
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478",
        ]
      }]
    };

    let peerConnection = new RTCPeerConnection(configuration);
    var conn = new SockJS("http://localhost:9190/socket");
    stompClient.current = new Stomp.over(conn);


    stompClient.current.connect({}, (frame) => {

      //   stompClient.current.subscribe("/user/" + localID + "/topic/offer", async (offer) => {
      //     console.log("offer: ", JSON.parse(offer.body));
      //     const offerData = JSON.parse(offer.body);
      //     await peerConnection.setRemoteDescription(JSON.parse(offerData.offer));

      //     console.log("setting remote description: ", peerConnection.remoteDescription);

      //     peerConnection.createAnswer().then(async (description) => {
      //       await peerConnection.setLocalDescription(description);
      //       console.log("setting description: ", peerConnection.localDescription);
      //       stompClient.current.send("/app/answer", {}, JSON.stringify({
      //         "toUser": offerData.fromUser.toString(),
      //         "fromUser": offerData.toUser.toString(),
      //         "answer": JSON.stringify(description)
      //       }));
      //     })
      //   })

      //   stompClient.current.subscribe("/user/" + localID + "/topic/candidate", async (answer) => {
      //     // console.log("candidate: ", JSON.parse(answer.body));
      //     const candidateData = JSON.parse(answer.body);

      //     console.log("candidate: ", candidateData);

      //     const candidate = JSON.parse(candidateData.candidate);
      //     console.log(candidate);
      //     console.log("remote description: ", peerConnection.remoteDescription);
      //     console.log("local description: ", peerConnection.localDescription);
      //     if (candidate && peerConnection && peerConnection.remoteDescription.type)
      //       await peerConnection.addIceCandidate(candidate);

      //   })

      stompClient.current.subscribe("/user/" + localID + "/topic/call", (call) => {
        console.log("call from: " + call.body);
        console.log("remote id: " + call.body);

        setRemoteId(call.body);

        setIncomingCall(true);

        peerConnection.onnegotiationneeded = async (event) => {
          await peerConnection.createOffer().then(async (description) => {
            await peerConnection.setLocalDescription(description);
            console.log("negotiation setting description: ", peerConnection.localDescription);
            stompClient.current.send("/app/offer", {}, JSON.stringify({
              "toUser": call.body.toString(),
              "fromUser": doctorId.toString(),
              "offer": JSON.stringify(description)
            }));
          })
        }


        //     stompClient.current.subscribe("/user/" + doctorId + "/topic/answer", async (answer) => {

        //       console.log("negotiation answer: ", answer.body);

        //       const answerData = JSON.parse(answer.body);

        //       await peerConnection.setRemoteDescription(JSON.parse(answerData.answer));
        //       console.log("negotiation remote description: ", peerConnection.remoteDescription);


        //     });


        //     peerConnection.onicecandidate = (event) => {
        //       console.log(event);
        //       if (event.candidate) {
        //         stompClient.current.send("/app/candidate", {}, {
        //           "toUser": call.body.toString(),
        //           "fromUser": localID.toString(),
        //           "candidate": JSON.stringify(event.candidate)
        //         })
        //       }
        //     }


        //   })


        //   peerConnection.ontrack = (event) => {
        //     console.log("remote streams: ", event.streams);
        //     remoteVideoRef.current.srcObject = event.streams[0];
        //   }

        //   navigator.mediaDevices.getUserMedia({
        //     video: true,
        //     audio: true
        //   }).then((stream) => {
        //     localVideoRef.current.srcObject = stream;
        //     stream.getTracks().forEach(track => {
        //       peerConnection.addTrack(track, stream);
        //     });
      })

    })



  }, [])





  return (
    <div>
      <div>Hi! {user["name"]}. This is your dashboard</div>
      {
        appointments.length === 0
          ?
          <div>You have No Appointments</div>
          :
          <div>
            Here are your Appointments

            <table>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Meeting Link</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((meeting, index) => (
                  <tr key={index}>
                    <td>{meeting.patient.id}</td>
                    <td><Link to='/video-call-patient' state={{ caller: doctorId, callee: meeting.patient.id }} >Click here to Join</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>


          </div>}

      <div>

        {
          incomingCall
            ?
            <div style={{ position: 'fixed', width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "rgb(0,0,0,0.9)", backdropFilter: blur("10px"), zIndex: "2", top: 0, bottom: 0, right: 0, left: 0 }}>
              <h4 style={{ color: "#fff" }}>
                Patient {remoteID} is calling you
              </h4>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "20%" }}>
                <button style={{ backgroundColor: "green" }} onClick={handleAcceptCall}>Accept</button>
                <button style={{ backgroundColor: "Red" }}>Reject</button>
              </div>

            </div>
            :
            <></>

        }

        {/* <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay /> */}
      </div>
    </div>
  )
}

export default DoctorDashboard