'use client'
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React, {  useContext } from 'react'
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useSidebar } from '../ui/sidebar'

const SidebarFooter = () => {
    const options = [
        {
            name:'Settings',
            icon:Settings,
            href:'/dashboard/settings'
        },
        {
            name:'Help & Feedback',
            icon:HelpCircle,
            href:'/faq'
        },
        {
            name:'My Subscriptions',
            icon:Wallet,
            href:'/dashboard/subscriptions'
        },
        {
            name:'Logout',
            icon:LogOut,
            href:'#'
        }
    ]

const {toggleSidebar} =useSidebar()
    const context =useContext(UserDetailContext);
    if(!context) throw new Error('UserDetailContext must be used within UserDetailProvider')
      const {setUserDetail} = context;
    
   const router = useRouter()
    const handleLogout = () => {
    if(typeof window !== 'undefined'){
      localStorage.removeItem('user')
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setUserDetail(null);
      toggleSidebar();
      //  router.push('/')
      window.location.reload()
    }
   
  }
  return (
    <div className='mb-10'>
      {
       options&& options?.map((option)=>(
            <div key={option.name} className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer' onClick={()=>{
                  if(option.name==='Logout'){
                    handleLogout()
                  }else{
                    router.push(option?.href)
                  }
                }}>
                <option.icon size={18}/>
                <span className='text-sm'>{option.name}</span>
            </div>
        ))
      }
    </div>
  )
}

export default SidebarFooter
