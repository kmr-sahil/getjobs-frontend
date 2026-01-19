"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import JobCard from "@/components/JobCard"

function Page() {
  const pathname = usePathname(); // "/company/Amazon"
  const companyName = decodeURIComponent(pathname.split("/").pop());

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyName) return;

    const fetchJobs = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACK_MAIN}/api/v1/job/list?company_name=${encodeURIComponent(
          companyName
        )}&limit=50`;

        const { data } = await axios.get(url);
        setJobs(data.all || []);
      } catch (err) {
        console.error("Failed to fetch company jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyName]);

  const company = {
    company: companyName,
    imageUrl: jobs[0]?.image_url || "",
    totalJobs: jobs.length,
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen">
        Loading jobs…
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="max-w-[75rem] mx-auto mb-8 px-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center bg-gray-100 p-4 rounded-lg">
            <img
              src={company.imageUrl}
              alt={`${company.company} logo`}
              className="w-16 h-16 rounded-lg bg-white"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                {company.company}
              </h1>
              <h5 className="text-sm">
                Has {company.totalJobs} open positions
              </h5>
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  jobTitle={job.job_title}
                  companyName={job.company_name}
                  isRemote={job.remote}
                  loc={job.work_loc}
                  img={job.image_url}
                  jobLink={job.job_link}
                  commitment={job.commitment}
                />
              ))
            ) : (
              <p>No jobs found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
