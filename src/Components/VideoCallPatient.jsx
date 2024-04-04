import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate } from 'react-router-dom';


const VideoCallPatient = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  let localVideoRef = useRef();
  let remoteVideoRef = useRef();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [remoteID, setRemoteId] = useState(location.state.callee);
  const [localID, setLocalId] = useState(location.state.caller);
  let peerConnection = useRef();
  let stompClient = useRef();

  const [testData, setTestData] = useState('');

  const navigate = useNavigate();


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
      console.log(frame);
      stompClient.current.subscribe("/topic/testServer", (msg) => {
        console.log(msg);
      })


      // stompClient.current.subscribe("/user/" + localID + "/topic/call", (call) => {
      //   debugger;
      //   console.log("call from: " + call.body);
      //   console.log("remote id: " + call.body);
      //   // console.log("helloo");


      // })

      stompClient.current.subscribe("/user/" + localID + "/topic/acceptCall", (accept) => {
        const acceptBody = JSON.parse(accept.body);
        console.log(accept);
        navigate(`/room/${acceptBody.roomID}`, {state: {callee:remoteID, caller: localID}});
      })


      // stompClient.current.subscribe("/user/" + localID + "/topic/offer", async (offer) => {
      //   console.log("offer: ", JSON.parse(offer.body));
      //   const offerData = JSON.parse(offer.body);
      //   await peerConnection.setRemoteDescription(JSON.parse(offerData.offer));

      //   console.log("setting remote description: ", peerConnection.remoteDescription);

      //   await peerConnection.createAnswer().then(async (description) => {
      //     await peerConnection.setLocalDescription(description);
      //     console.log("setting description: ", peerConnection.localDescription);
      //     stompClient.current.send("/app/answer", {}, JSON.stringify({
      //       "toUser": offerData.fromUser.toString(),
      //       "fromUser": offerData.toUser.toString(),
      //       "answer": JSON.stringify(description)
      //     }));
      //   })
      // })

      // peerConnection.onnegotiationneeded = async (event) => {
      //   await peerConnection.createOffer().then(async (description) => {
      //     await peerConnection.setLocalDescription(description);
      //     console.log("negotiation setting description: ", peerConnection.localDescription);
      //     stompClient.current.send("/app/offer", {}, JSON.stringify({
      //       "toUser": remoteID.toString(),
      //       "fromUser": localID.toString(),
      //       "offer": JSON.stringify(description)
      //     }));
      //   })
      // }

      // peerConnection.onicecandidate = (event) => {
      //   if (event.candidate) {
      //     // var candidate = {
      //     //   type: "candidate",
      //     //   lable: event.candidate.sdpMLineIndex,
      //     //   id: event.candidate.candidate,
      //     // }
      //     // console.log("Sending Candidate")
      //     // console.log(candidate);
      //     console.log("original candidate: ", event.candidate)
      //     stompClient.current.send("/app/candidate", {}, JSON.stringify({
      //       "toUser": remoteID.toString(),
      //       "fromUser": localID.toString(),
      //       "candidate": JSON.stringify(event.candidate)
      //     }));
      //   }
      // }


      // peerConnection.createOffer().then(async (description) => {
      //   await peerConnection.setLocalDescription(description);
      //   console.log("setting description: ", description);
      //   stompClient.current.send("/app/offer", {}, JSON.stringify({
      //     "toUser": remoteID.toString(),
      //     "fromUser": localID.toString(),
      //     "offer": JSON.stringify(description)
      //   }))
      // })

      // stompClient.current.subscribe("/user/" + localID + "/topic/answer", async (answer) => {

      //   console.log(answer.body);

      //   const answerData = JSON.parse(answer.body);

      //   await peerConnection.setRemoteDescription(JSON.parse(answerData.answer));
      //   console.log("remote description: ", peerConnection.remoteDescription);

      // });


      // stompClient.current.subscribe("/user/" + localID + "/topic/candidate", async (answer) => {
      //   // console.log("candidate: ", JSON.parse(answer.body));
      //   const candidateData = JSON.parse(answer.body);

      //   console.log("candidate: ", candidateData);

      //   const candidate = JSON.parse(candidateData.candidate);

      //   console.log("remote description: ", peerConnection.remoteDescription);

      //   if (candidate && peerConnection && peerConnection.remoteDescription.type)
      //     await peerConnection.addIceCandidate(candidate);

      //   // await peerConnection.addIceCandidate(candidateData.candidate.id);
      // })


      // peerConnection.ontrack = (event) => {
      //   console.log(event);
      //   remoteVideoRef.current.srcObject = event.streams[0];
      // }

      // navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: true
      // }).then((stream) => {
      //   localVideoRef.current.srcObject = stream;
      //   stream.getTracks().forEach(track => {
      //     peerConnection.addTrack(track, stream);
      //   });
      // })



      // stompClient.current.send("/app/addUser", {}, localID.toString());

      stompClient.current.send("/app/call", {}, JSON.stringify({
        "callTo": remoteID.toString(),
        "callFrom": localID.toString()
      }));

    });



  }, [])

  const handleChange = (e) => {
    setTestData(e.target.value);
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log(testData)
    stompClient.current.send("/app/testServer", {}, testData);

  }



  return (
    <div>
      Calling Doctor {remoteID}....
    </div>
  );
};

export default VideoCallPatient;
