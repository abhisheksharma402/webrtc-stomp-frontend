import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';




const Room = () => {
     const location = useLocation();

     console.log(location)

     let stompClient = useRef();

     let localVideoRef = useRef();
     let remoteVideoRef = useRef();
     const [remoteID, setRemoteId] = useState(location.state.callee);
     const [localID, setLocalId] = useState(location.state.caller);


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

               stompClient.current.subscribe("/user/" + localID + "/topic/offer", async (offer) => {
                    console.log("offer: ", JSON.parse(offer.body));
                    const offerData = JSON.parse(offer.body);
                    await peerConnection.setRemoteDescription(JSON.parse(offerData.offer));

                    console.log("setting remote description: ", peerConnection.remoteDescription);

                    peerConnection.createAnswer().then(async (description) => {
                         await peerConnection.setLocalDescription(description);
                         console.log("setting description: ", peerConnection.localDescription);
                         stompClient.current.send("/app/answer", {}, JSON.stringify({
                              "toUser": offerData.fromUser.toString(),
                              "fromUser": offerData.toUser.toString(),
                              "answer": JSON.stringify(description)
                         }));
                    })
               })   

               stompClient.current.subscribe("/user/" + localID + "/topic/candidate", async (answer) => {
                    // console.log("candidate: ", JSON.parse(answer.body));
                    const candidateData = JSON.parse(answer.body);

                    console.log("candidate: ", candidateData);

                    const candidate = JSON.parse(candidateData.candidate);
                    console.log(candidate);
                    console.log("remote description: ", peerConnection.remoteDescription);
                    console.log("local description: ", peerConnection.localDescription);
                    if (candidate && peerConnection && peerConnection.remoteDescription.type)
                         await peerConnection.addIceCandidate(candidate);

               })// import React, { useEffect, useRef, useState } from 'react'
               // import { useLocation } from 'react-router-dom';
               // import SockJS from 'sockjs-client';
               // import Stomp from 'stompjs';
               
               
               
               
               // const Room = () => {
               //      const location = useLocation();
               
               //      console.log(location)
               
               //      let stompClient = useRef();
               
               //      let localVideoRef = useRef();
               //      let remoteVideoRef = useRef();
               //      const [remoteID, setRemoteId] = useState(location.state.callee);
               //      const [localID, setLocalId] = useState(location.state.caller);
               
               
               //      useEffect(() => {
               
               //           var configuration = {
               //                iceServers: [{
               //                     urls: [
               //                          "stun:stun.l.google.com:19302",
               //                          "stun:global.stun.twilio.com:3478",
               //                     ]
               //                }]
               //           };
               
               //           let peerConnection = new RTCPeerConnection(configuration);
               //           var conn = new SockJS("http://localhost:9190/socket");
               //           stompClient.current = new Stomp.over(conn);
               
               
               //           stompClient.current.connect({}, (frame) => {
               
               //                stompClient.current.subscribe("/user/" + localID + "/topic/offer", async (offer) => {
               //                     console.log("offer: ", JSON.parse(offer.body));
               //                     const offerData = JSON.parse(offer.body);
               //                     await peerConnection.setRemoteDescription(JSON.parse(offerData.offer));
               
               //                     console.log("setting remote description: ", peerConnection.remoteDescription);
               
               //                     peerConnection.createAnswer().then(async (description) => {
               //                          await peerConnection.setLocalDescription(description);
               //                          console.log("setting description: ", peerConnection.localDescription);
               //                          stompClient.current.send("/app/answer", {}, JSON.stringify({
               //                               "toUser": offerData.fromUser.toString(),
               //                               "fromUser": offerData.toUser.toString(),
               //                               "answer": JSON.stringify(description)
               //                          }));
               //                     })
               //                })   
               
               //                stompClient.current.subscribe("/user/" + localID + "/topic/candidate", async (answer) => {
               //                     // console.log("candidate: ", JSON.parse(answer.body));
               //                     const candidateData = JSON.parse(answer.body);
               
               //                     console.log("candidate: ", candidateData);
               
               //                     const candidate = JSON.parse(candidateData.candidate);
               //                     console.log(candidate);
               //                     console.log("remote description: ", peerConnection.remoteDescription);
               //                     console.log("local description: ", peerConnection.localDescription);
               //                     if (candidate && peerConnection && peerConnection.remoteDescription.type)
               //                          await peerConnection.addIceCandidate(candidate);
               
               //                })
               
               //                stompClient.current.subscribe("/user/" + localID + "/topic/answer", async (answer) => {
               
               //                     console.log("negotiation answer: ", answer.body);
               
               //                     const answerData = JSON.parse(answer.body);
               
               //                     await peerConnection.setRemoteDescription(JSON.parse(answerData.answer));
               //                     console.log("negotiation remote description: ", peerConnection.remoteDescription);
               
               
               //                });
               
               //                peerConnection.createOffer().then(async (description) => {
               //                     await peerConnection.setLocalDescription(description);
               //                     console.log("setting description: ", description);
               //                     stompClient.current.send("/app/offer", {}, JSON.stringify({
               //                          "toUser": remoteID.toString(),
               //                          "fromUser": localID.toString(),
               //                          "offer": JSON.stringify(description)
               //                     }))
               //                })
               
               //                peerConnection.onnegotiationneeded = async (event) => {
               //                     await peerConnection.createOffer().then(async (description) => {
               //                          await peerConnection.setLocalDescription(description);
               //                          console.log("negotiation setting description: ", peerConnection.localDescription);
               //                          stompClient.current.send("/app/offer", {}, JSON.stringify({
               //                               "toUser": remoteID.toString(),
               //                               "fromUser": localID.toString(),
               //                               "offer": JSON.stringify(description)
               //                          }));
               //                     })
               //                }
               
               
               //                peerConnection.onicecandidate = (event) => {
               //                     console.log(event);
               //                     if (event.candidate) {
               //                          stompClient.current.send("/app/candidate", {}, JSON.stringify({
               //                               "toUser": remoteID.toString(),
               //                               "fromUser": localID.toString(),
               //                               "candidate": JSON.stringify(event.candidate)
               //                          }))
               //                     }
               //                }
               
               //                peerConnection.ontrack = (event) => {
               //                     console.log("remote streams: ", event.streams);
               //                     remoteVideoRef.current.srcObject = event.streams[0];
               //                }
               
               //                navigator.mediaDevices.getUserMedia({
               //                     video: true,
               //                     audio: true
               //                }).then((stream) => {
               //                     localVideoRef.current.srcObject = stream;
               //                     stream.getTracks().forEach(track => {
               //                          peerConnection.addTrack(track, stream);
               //                     });
               //                })
               
               //           })
               
               
               
               //      }, [])
               
               
               
               
               
               //      return (
               //           // <div>Room</div>
               
               //           <div>
               //                <video ref={localVideoRef} autoPlay muted />
               //                <video ref={remoteVideoRef} autoPlay />
               //           </div>
               //      )
               // }
               
               // export default Room
               
               

               stompClient.current.subscribe("/user/" + localID + "/topic/answer", async (answer) => {

                    console.log("negotiation answer: ", answer.body);

                    const answerData = JSON.parse(answer.body);

                    await peerConnection.setRemoteDescription(JSON.parse(answerData.answer));
                    console.log("negotiation remote description: ", peerConnection.remoteDescription);

               });

               peerConnection.createOffer().then(async (description) => {
                    await peerConnection.setLocalDescription(description);
                    console.log("setting description: ", description);
                    stompClient.current.send("/app/offer", {}, JSON.stringify({
                         "toUser": remoteID.toString(),
                         "fromUser": localID.toString(),
                         "offer": JSON.stringify(description)
                    }))
               })

               peerConnection.onnegotiationneeded = async (event) => {
                    await peerConnection.createOffer().then(async (description) => {
                         await peerConnection.setLocalDescription(description);
                         console.log("negotiation setting description: ", peerConnection.localDescription);
                         stompClient.current.send("/app/offer", {}, JSON.stringify({
                              "toUser": remoteID.toString(),
                              "fromUser": localID.toString(),
                              "offer": JSON.stringify(description)
                         }));
                    })
               }


               peerConnection.onicecandidate = (event) => {
                    console.log(event);
                    if (event.candidate) {
                         stompClient.current.send("/app/candidate", {}, JSON.stringify({
                              "toUser": remoteID.toString(),
                              "fromUser": localID.toString(),
                              "candidate": JSON.stringify(event.candidate)
                         }))
                    }
               }

               peerConnection.ontrack = (event) => {
                    console.log("remote streams: ", event.streams);
                    remoteVideoRef.current.srcObject = event.streams[0];
               }

               navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
               }).then((stream) => {
                    localVideoRef.current.srcObject = stream;
                    stream.getTracks().forEach(track => {
                         peerConnection.addTrack(track, stream);
                    });
               })

          })



     }, [])





     return (
          // <div>Room</div>

          <div>
               <video ref={localVideoRef} autoPlay muted />
               <video ref={remoteVideoRef} autoPlay />
          </div>
     )
}

export default Room

