import { useState, useEffect } from "react"
import { FiGithub } from "react-icons/fi";
import QRCode from "react-qr-code";

import { api } from "../consts";

const DesktopPage = () => {
  const [session, setSession] = useState(null)
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      let savedBeamSession = localStorage.getItem('session')
      if (savedBeamSession != null) {
        setSession(JSON.parse(savedBeamSession))
      } else {
        api.post('beams/create/')
          .then(response => {
            console.log('Beam created:', response.data);
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            setSession({...response.data, expiresAt: expiresAt})
            localStorage.setItem("session", JSON.stringify({...response.data, expiresAt: expiresAt}))
          })
          .catch(error => {
            console.error('Error creating beam:', error);
          });
      }
    }
  }, [])

  return (
    <section id="main" className='flex justify-center items-center gap-5 flex-col min-h-[100vh]'>
      <div className='fixed top-0 right-0 mt-8 mr-8 bg-white rounded-md'>
        {connectedDevices.length > 0 && session && <QRCode value={JSON.stringify(session)} fgColor='#fff' bgColor='#4C319CFF' size="100" className='rounded-md drop-shadow-2xl drop-shadow-[#7f5af0a1]' />}
      </div>
      <h1 className='text-4xl goldman-regular logo-animate-container'>
        <span className='logo-animate-text'>MoveIt</span>
      </h1>
       
       {connectedDevices.length == 0 && session && <QRCode value={JSON.stringify(session)} fgColor='#fff' bgColor='#4C319CFF' size="300" className='rounded-md drop-shadow-2xl drop-shadow-[#7f5af0a1] mb-10' />}
      <h1 className='text-3xl'>Scan the QR Code with your mobile phone to start sharing.</h1>
      <h4>Share Clipboards / Links / Pictures / Videos</h4>
      <div className='flex gap-8 mt-2 brain-boom-btns'>
        <button className='brain-boom-btn'>Know More</button>
        <a href='https://github.com/khaled-muhammad/moveit' target='_blank' rel='noopener noreferrer' className='brain-boom-btn'>
          <FiGithub />
          GitHub Repo
        </a>
      </div>
    </section>
  )
}

export default DesktopPage