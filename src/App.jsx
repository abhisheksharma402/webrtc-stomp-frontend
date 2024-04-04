import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login';
// import Call from './Components/Call';
import PatientDashboard from './Components/PatientDashboard';
import DoctorDashboard from './Components/DoctorDashboard';
import VideoCallPatient from './Components/VideoCallPatient';
// import DoctorCallRoom from './Components/DoctorCallRoom';/
import Room from './Components/Room';



const router = createBrowserRouter([

  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/video-call-patient",
    element: <VideoCallPatient/>,
  },
  {
    path: "/patient-dashboard",
    element: <PatientDashboard/>,
  },
  {
    path: "/doctor-dashboard",
    element: <DoctorDashboard/>,
  },
  {
    // path: "/doc-call",
    // element: <DoctorCallRoom/>
  },
  {
    path: "/room/:roomID",
    element: <Room/>
  }


]);


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
