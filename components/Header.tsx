"use client"
import { Button } from '@/components/ui/button'
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Columns2} from 'lucide-react'
import { useSidebar } from './ui/sidebar'


const Header = () => {
  const context = useContext(UserDetailContext)
  if (!context) throw new Error('UserDetailContext must be used within UserDetailProvider')
  
  const { userDetail } = context


 console.log('userDetails',userDetail)

  
const {toggleSidebar} = useSidebar()
  return (
    <div className='p-4 flex items-center justify-between'>
     {
      userDetail?.name&&  <Button variant='ghost' onClick={toggleSidebar}>
        <Columns2 />
      </Button>
     }
      {
        userDetail?.name && (
          <div className='relative'>
            <Image
              src={userDetail?.pic}
              alt='User'
              width={35}
              height={35}
              className='rounded-full cursor-pointer'
            />
          </div>
        )
      }
    </div>
  )
}

export default Header