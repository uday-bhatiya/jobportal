"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "student" | "recruiter";
}


export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const handleLogOut = async () => {
    try {
      console.log("Logging out...");
      await axios.get('/api/user/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const fetchUser = async () => {
    try {
      if (user === null) {
        const response = await axios.get('/api/user/profile');
      setUser(response.data.user);
      // console.log(response.data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
      fetchUser();
  }, [])

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      {
        user?.role === 'student' ? (
          <Menu setActive={setActive}>

            <HoveredLink href="/home">Home</HoveredLink>
            <HoveredLink href="/student/jobs">Jobs</HoveredLink>

            <MenuItem setActive={setActive} active={active} item="Profile">
              <div className="flex flex-col space-y-4 text-sm">
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href={`/profile/${user?._id}`}>Edit</HoveredLink></Button>
                <Button onClick={handleLogOut} className="text-white border border-white bg-transparent hover:bg-transparent">
                  Logout
                </Button>
              </div>
            </MenuItem>
          </Menu>

        ) : (
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Companies">
              <div className="flex flex-col space-y-4 text-sm">
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href="/admin/companies">All Companies</HoveredLink></Button>
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href="/admin/create-company">New Company</HoveredLink></Button>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Jobs">
              <div className="flex flex-col space-y-4 text-sm">
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href="/admin/jobs">All Jobs</HoveredLink></Button>
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href="/admin/create-job">New Job</HoveredLink></Button>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Profile">
              <div className="flex flex-col space-y-4 text-sm">
                <Button className="border border-white bg-transparent hover:bg-transparent"><HoveredLink href={`/profile/${user?._id}`}>Edit</HoveredLink></Button>
                <Button onClick={handleLogOut} className="text-white border border-white bg-transparent hover:bg-transparent">
                  Logout
                </Button>
              </div>
            </MenuItem>
          </Menu>
        )
      }
    </div>
  );
}