'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Applicant {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  _id: string;
}

interface Application {
  _id: string;
  fullname: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  applicant: Applicant;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  experienceLevel: string;
  location: string;
  jobType: string;
  position: string;
  company: string;
  createdBy: string;
  applications: Application[];
}

export default function page() {

  const pathname = usePathname();
  const parts = pathname.split('/');
  const jobId = parts[parts.length - 1];

  const [job, setJob] = useState<Job>();
  const [application, setApplication] = useState<Application>();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const deleteJobHandler = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/job/admin/delete-job/${jobId}`);
      router.back();
    } catch (error) {
      console.error("Failed to delete job", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchJob = async () => {
    try {

      const response = await axios.get(`/api/job/admin/get-job/${jobId}`);
      // console.log("Response", response.data.job)
      // console.log("Response2", response.data.job.applications)
      setJob(response.data.job)

    } catch (error) {
      console.error(" failed to fetch job", error)
    }
  }

  const fetchApplicants = async () => {
    try {
      if (job) {
        job.applications.map((application) => {
          setApplication(application)

        })
      }

    } catch (error) {
      console.error(" failed to fetch applicants", error)
    }
  }

  const updateStatusHandler = async (applicantId: string, newStatus: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/application/admin/application-status/${applicantId}`, { status: newStatus });
      fetchJob(); // Refresh the job data
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [])

  useEffect(() => {
    fetchApplicants();
  }, [fetchJob])


  return (
    <div className="mt-32 px-80">
      <Card>
        <CardHeader>
          <CardTitle>{job?.title}</CardTitle>
          <CardDescription>{job?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Experience Level</TableCell>
                  <TableCell>Job Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{job?.location}</TableCell>
                  <TableCell>{job?.salary}</TableCell>
                  <TableCell>{job?.experienceLevel}</TableCell>
                  <TableCell>{job?.jobType}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                      <div onClick={() => router.push(`/admin/update-job/${jobId}`)} className='flex items-center justify-center py-1.5 border border-white rounded-sm my-1 gap-2 w-full cursor-pointer'>
                        <Edit2 className='w-4' />
                        <span>Update</span>
                      </div>
                        <div className="flex flex-col gap-2">
                          <Button onClick={deleteJobHandler} variant="destructive" size="sm" disabled={loading}>
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
      <Card>
      <CardHeader>
          <CardTitle>Appplications</CardTitle>
        </CardHeader>
      <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job?.applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>{application.applicant.fullName}</TableCell>
                    <TableCell>{application.applicant.email}</TableCell>
                    <TableCell>{application.status}</TableCell>
                    <TableCell className='flex gap-2'>
                      <Button onClick={() => updateStatusHandler(application._id, "Accepted")}>
                        Accept
                      </Button>
                      <Button onClick={() => updateStatusHandler(application._id, "Rejected")} variant="destructive">
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
