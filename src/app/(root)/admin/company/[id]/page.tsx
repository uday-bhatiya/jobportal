'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
  website: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function page() {

  const pathname = usePathname();
  const parts = pathname.split('/');
  const companyId = parts[parts.length - 1]

  const [company, setCompany] = useState<Company>();
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const deleteCompanyHandler = async () => {
    setLoading(true);
   try {
    await axios.delete(`/api/company/delete-company/${companyId}`);
    router.back();
   } catch (error) {
    console.error("Failed to delete company", error);
   } finally {
    setLoading(false);
   }
  }

  const fetchCompany = async () => {
    try {

      const response = await axios.get(`/api/company/get-company/${companyId}`);
      console.log("Response",response.data.company)
      setCompany(response.data.company)
      
    } catch (error) {
      console.error(" failed to fetch company", error)
    }
  }

  useEffect(() => {
    fetchCompany();
  },[])

  return (
    <div className='mt-32 px-80'>
    <Card>
      <CardHeader>
        <CardTitle>{company?.name}</CardTitle>
        <CardDescription>{company?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{company?.location}</TableCell>
                <TableCell>
                  <a href={`https://${company?.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {company?.website}
                  </a>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        <Button onClick={deleteCompanyHandler} variant="destructive" size="sm" disabled={loading}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {loading ? 'Deleting...' : 'Delete'}
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
  )
}
