import { useState } from 'react'
import QRCode from "react-qr-code";

function App() {

  return (
    <section id="main" className='flex justify-center items-center gap-5 flex-col min-h-[100vh]'>
      <div className='fixed top-0 right-0 mt-8 mr-8 bg-white rounded-md'>
        <QRCode value="Jsadfklakdkjdfsapodjiko" fgColor='#F5F5F7' bgColor='#0F0F1A' size="100" className='rounded-md drop-shadow-2xl drop-shadow-[#7f5af0a1]' />
      </div>
      <h1 className='text-4xl goldman-regular logo-animate-container'>
        <span className='logo-animate-text'>MoveIt</span>
      </h1>
      <h1 className='text-3xl'>Scan the QR Code with your mobile phone to start sharing.</h1>
      <h4>Share Clipboards / Links / Pictures / Videos</h4>
      <div className='flex gap-8 mt-2 brain-boom-btns'>
        <button className='from-[#1A1B2E] to-[#7F5AF0] bg-gradient-to-tr px-5 py-3 rounded-2xl cursor-pointer brain-boom-btn'>Know More</button>
        <a href='https://github.com/your-repo-link' target='_blank' rel='noopener noreferrer' className='from-[#1A1B2E] to-[#7F5AF0] bg-gradient-to-tr px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-2 brain-boom-btn'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
            <path d='M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z'/>
          </svg>
          GitHub Repo
        </a>
      </div>
    </section>
  )
}

export default App
