'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface User {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: "student" | "recruiter";
}

export default function page() {

    const [user, setUser] = useState<User | null>(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axios.get('/api/user/profile');
    //             setUser(response.data.user);
    //             console.log(response.data.user)
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     }
    //     fetchUser();
    // }, [])

    return (
        <div>
           
        </div>
    )
}
