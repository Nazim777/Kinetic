'use client'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import {api} from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'
import { useSidebar } from '../ui/sidebar'
type workspaceType =  {
    _id: Id<"workspaces">;
    _creationTime: number;
    fileData?: any;
    user: Id<"users">;
    message: any;
}[]

const WorkspaceHistory = () => {
   const context = useContext(UserDetailContext)
   const {toggleSidebar} = useSidebar()
   if (!context) {
    throw new Error("WorkspaceHistory must be used within a UserDetailProvider");
  }
  const {userDetail,setUserDetail} = context;
  const [workspaceList,setWorkspaceList] = useState<workspaceType>()

const convex = useConvex()

const getAllWorkspaceForUser = async(userId:string)=>{
  console.log('userId',userId)
  if(!userId) return;
     const result = await convex.query(api.workspace.getAllWorkspaces,{
        userId:userId as Id<'users'>
     })
     console.log('result',result)
     setWorkspaceList(result)
}

useEffect(()=>{
userDetail?._id&& getAllWorkspaceForUser(userDetail._id.toString())
},[userDetail])
  return (
    <div>
       <h2 className='font-medium text-lg'>Your Chats</h2>
       <div>
        {workspaceList&& workspaceList?.map((workspace)=>
       <Link key={workspace._id} href={`/workspace/${workspace._id}`}>
        <h2 onClick={toggleSidebar} className='text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white'>
            {workspace.message[0]?.content}

        </h2>
       </Link>
        )}
       </div>
      
    </div>
  )
}

export default WorkspaceHistory
