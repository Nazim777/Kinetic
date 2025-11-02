'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "../ui/button"
import { MessageCircleCode } from "lucide-react"
import WorkspaceHistory from "../workspace/WorkspaceHistory"
import FooterSidebar from "./SidebarFooter"
import Link from "next/link"
import {useRouter} from 'next/navigation'
export function AppSidebar() {
  const router = useRouter()
  return (
    <Sidebar>
      <SidebarHeader> 
       <Link href='/'>
        <Image src={"https://bolt.new/static/favicon.svg"} alt='Logo' width={50} height={50}/>
      </Link>
        </SidebarHeader>
      <SidebarContent className="p-5">
        <Button className="cursor-pointer" onClick={()=>{
          router.push('/workspace')
        }}> <MessageCircleCode/> Create New Chat</Button>
        <SidebarGroup >
         <WorkspaceHistory/>
        </SidebarGroup>   
      </SidebarContent>
      <SidebarFooter>
      <FooterSidebar/>
      </SidebarFooter>
    </Sidebar>
  )
}