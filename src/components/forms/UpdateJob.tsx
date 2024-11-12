'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface Company {
  _id: string;
  name: string;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Job title is required." }),
  description: z.string().min(2, { message: "Job description is required." }),
  requirements: z.string().optional(),
  salary: z.string().min(1, { message: "Salary is required." }),
  experienceLevel: z.string().min(1, { message: "Experience level is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  jobType: z.string().min(1, { message: "Job type is required." }),
  position: z.string().min(2, { message: "Position is required." }),
  company: z.string().min(2, { message: "Company name is required." }),
});

export default function UpdateJob() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const jobId = parts[parts.length - 1];
  const [companies, setCompanies] = useState<Company[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      salary: "",
      experienceLevel: "",
      location: "",
      jobType: "",
      position: "",
      company: "",
    },
  });

  const getCompanies = async () => {
    try {
      const response = await axios.get('/api/company/get-companies');
      setCompanies(response.data.companies);
    } catch (error) {
      console.log(error);
    }
  };

  const getJobDetails = async () => {
    try {
      const response = await axios.get(`/api/job/admin/get-job/${jobId}`);
      const jobData = response.data.job;
      console.log(jobData)

      form.setValue("title", jobData.title);
      form.setValue("description", jobData.description);
      form.setValue("requirements", jobData.requirements.join(", "));
      form.setValue("salary", jobData.salary);
      form.setValue("experienceLevel", jobData.experienceLevel);
      form.setValue("location", jobData.location);
      form.setValue("jobType", jobData.jobType);
      form.setValue("position", jobData.position);
      form.setValue("company", jobData.company);
    } catch (error) {
      console.error("Failed to fetch job details", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = { ...values, jobId };
    setLoading(true);
    console.log("hello")
    console.log("Values", values)
    try {
      const response = await axios.patch(`/api/job/admin/update-job/${jobId}`, payload);
      if (response.data.success) {
        router.push('/admin/jobs');
      }
    } catch (error) {
      console.error('Failed to update job', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCompanies();
    if (jobId) getJobDetails();
  }, [jobId]);

  return (
    <div className='mx-auto flex items-center justify-center w-full flex-col gap-1'>
      <Form {...form}>
        <h1 className='font-bold text-2xl pt-10'>Update Job</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 space-y-2 w-5/6 sm:w-4/6 lg:w-2/6 h-min bg-black px-5 py-12 rounded-md">

          {/* Job Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter job description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Requirements */}
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter job requirements" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary */}
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="Enter salary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Experience Level */}
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Type */}
          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Position */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Enter position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Company</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((company) => (
                        <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          {loading ? (
            <Button disabled className="rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Update Job</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
