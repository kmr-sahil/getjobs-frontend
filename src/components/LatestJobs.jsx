import JobCard from "./JobCard";

export default async function LatestJobs() {
  const categories = [
    { name: "Tech Jobs", category: "tech" },
    { name: "Sales Jobs", category: "sales" },
    { name: "Design Jobs", category: "design" },
  ];

  const baseApiUrl = `${process.env.NEXT_PUBLIC_BACK_MAIN}/api/v1/job/list?search=&loc=&remote=&commitment=&level=&page=1`;

  try {
    const jobPromises = categories.map(({ category }) =>
      fetch(`${baseApiUrl}&categories=${category}`, {
        next: { revalidate: 1000 },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${category}`);
        }
        return res.json();
      })
    );

    const jobData = await Promise.all(jobPromises);

    return (
      <div className="w-full flex flex-col gap-8">
        {/* Latest Jobs (Tech) */}
        <section>
          <h2 className="text-xl font-medium mb-4">Latest Jobs</h2>
          <div className="flex flex-col items-center gap-4">
            {jobData[0]?.all?.map((job) => (
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
            ))}
          </div>
        </section>

        {/* Other Categories */}
        {categories.slice(1).map(({ name, category }, index) => (
          <section key={category}>
            <h2 className="text-xl font-medium mb-4">{name}</h2>
            <div className="flex flex-col items-center gap-4">
              {jobData[index + 1]?.all?.map((job) => (
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
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-lg text-red-500">
          Failed to load jobs. Please try again later.
        </p>
      </div>
    );
  }
}
