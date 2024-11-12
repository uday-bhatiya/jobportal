'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import axios from 'axios';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';

type Job = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description: string;
  experienceLevel: string;
  jobType: string;
  location: string;
  position: string;
  requirements: string[];
  salary: string;
  title: string;
  applications: string[];
  company: {
    _id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  } | null; // Make 'company' nullable
};

export default function LatestJob() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/job/student/get-jobs');
        console.log(response.data.jobs); // Logs the API response
        setJobs(response.data.jobs); // Sets the jobs state
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-blue-500 dark:text-blue-500">Latest & Top </span> Job Openings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        {jobs.map((job, index) => (
          <Card onClick={()=> router.push(`/job-details/${job._id}`)} key={index}>
            <CardHeader className='items-start'>
              <CardTitle className='items-start'>{job?.company?.name || "Company Name Not Available"}</CardTitle>
              <span>India</span>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mt-4">
                <Badge className={'text-blue-700 font-bold'} variant="default">
                  {job.position} Positions
                </Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="default">
                  {job.salary} LPA
                </Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="default">
                  {job.jobType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
