'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios'
import { CloudCog } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Application {
  _id: string;
  job: string;
  applicant: string;
  status: string;
}

interface Job {
  _id: string;
  company: string;
  createdBy: string;
  createdAt: string;
  description: string;
  experienceLevel: string;
  jobType: string;
  location: string;
  position: string;
  requirements: string[];
  salary: string;
  title: string;
  applications: Application[];
}

export default function page() {

  const pathname = usePathname()
  const parts = pathname.split('/');
  const jobId = parts[parts.length - 1];
  const router = useRouter();

  const [job, setJob] = useState<Job | undefined>();
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const jobApplyHandler = async () => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem('token'); 
      console.log(token)
      if (!token) {
        alert("You are not logged in!");
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`/api/application/student/apply-for-job/${jobId}`);
      console.log("REEEEEE",response)
  
      if (response.data.success) {
        setIsApplied(true); // Application successful
        alert("Successfully applied for the job!");
        router.replace("/home");
      } else {
        alert(response.data.message); // Inform user about issues
      }
    } catch (error) {
      console.error("Error applying for the job", error);
      alert("An error occurred while applying. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/job/student/get-job/${jobId}`);
        setJob(response.data.job);
        console.log(response.data.job);
      } catch (error) {
        console.log(error);
      }
    }
    fetchJob();
  }, []);

  return (
    <div className='max-w-7xl px-8 mx-auto my-40'>
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='font-bold text-xl'>{job?.title}</h1>
        <div className='flex items-center gap-2 mt-4'>
          <Badge className={'text-blue-700 font-bold'} variant="default">{job?.position} Positions</Badge>
          <Badge className={'text-[#F83002] font-bold'} variant="default">{job?.jobType}</Badge>
          <Badge className={'text-[#7209b7] font-bold'} variant="default">{job?.salary}LPA</Badge>
        </div>
      </div>
      <Button 
        onClick={jobApplyHandler} 
        disabled={isApplied || loading} // Disable if already applied or loading
      >
        {loading ? "Applying..." : isApplied ? "Already Applied" : "Apply"}
      </Button>
    </div>
    <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
    <div className='my-4'>
      <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-200'>{job?.title}</span></h1>
      <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-200'>{job?.location}</span></h1>
      <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-200'>{job?.description}</span></h1>
      <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-200'>{job?.experienceLevel} yrs</span></h1>
      <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-200'>{job?.salary}LPA</span></h1>
      <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-200'>{job?.applications?.length}</span></h1>
      <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-200'>{job?.createdAt.split("T")[0]}</span></h1>
    </div>
  </div>
  )
}
