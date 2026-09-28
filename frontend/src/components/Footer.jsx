import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* Left Section */}
        <div>
          <img onClick={() => { navigate('/'); scrollTo(0, 0); }} className='mb-5 w-40 cursor-pointer' src={assets.logo} alt="Prescripto" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Prescripto is committed to delivering accessible, reliable, and modern healthcare scheduling. Connect with certified specialists, manage your health appointments, and pay securely online.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li onClick={() => { navigate('/'); scrollTo(0, 0); }} className='cursor-pointer hover:text-primary'>Home</li>
            <li onClick={() => { navigate('/about'); scrollTo(0, 0); }} className='cursor-pointer hover:text-primary'>About us</li>
            <li onClick={() => { navigate('/contact'); scrollTo(0, 0); }} className='cursor-pointer hover:text-primary'>Contact us</li>
            <li className='cursor-pointer hover:text-primary'>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>contact@prescripto.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className='border-gray-300' />
        <p className='py-5 text-sm text-center text-gray-500'>Copyright 2026 @ Prescripto - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
