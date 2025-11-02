"use client";
import { Hero } from "@/components/Hero";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
export default function Home() {
  const context = useContext(UserDetailContext);
  if (!context) throw new Error("UserDetailContext is null");
  const { userDetail, setUserDetail } = context;
  const [LoggedInUser, setLoggedInUser] = useState();
  const convex = useConvex();
  const getUser = async () => {
    const result = await convex.query(api.user.GetUser, {
      // @ts-ignore
      email: userDetail?.email || LoggedInUser?.email,
    });
    console.log('user from database',result)
    if (result) {
      // @ts-ignore
      setUserDetail(result);
    }
  };
  useEffect(() => {
    // @ts-ignore
    if (userDetail?.email || LoggedInUser?.email) {
      getUser();
    }
  }, [userDetail,LoggedInUser]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if(user){
    setLoggedInUser(JSON.parse(user));
    }
    
  }, []);

  console.log('loggedInuser',LoggedInUser)
  return (
    <div className="">
      <Hero />
    </div>
  );
}
