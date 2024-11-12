'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Job {
  _id: string;
  name: string;
  title: string;
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

  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    try {

      const response = await axios.get('/api/job/admin/get-jobs');
      setJobs(response.data.jobs);
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [])

  const router = useRouter();
  return (
    <div className='mt-32 px-80'>
      <Table className='border border-solid'>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            jobs?.map((job) => (
              <tr>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div onClick={() => router.push(`/admin/job/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                        <Edit2 className='w-4' />
                        <span>Edit</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>

            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}
