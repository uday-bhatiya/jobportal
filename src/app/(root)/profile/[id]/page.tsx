'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

export default function UserDetailsPage() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const userId = parts[parts.length - 1];

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const deleteUserHandler = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/user/delete-user/${userId}`);
      router.push('/login')
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/user/get-user/${userId}`);
      console.log("Response", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="mt-32 px-80">
      <Card>
        <CardHeader>
          <CardTitle>{user?.fullName}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{user?.phoneNumber}</TableCell>
                  <TableCell>{user?.role}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col gap-2">
                          <Button onClick={deleteUserHandler} variant="destructive" size="sm" disabled={loading}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {loading ? 'Deleting...' : 'Delete Account'}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
