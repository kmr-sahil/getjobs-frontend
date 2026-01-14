import NotFound from "@/components/NotFound";
import EmailCollector from "@/components/EmailCollector";

const API_URL = process.env.NEXT_PUBLIC_BACK_MAIN;

function buildJobSchema(job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.job_title,
    description: job.description,
    datePosted: new Date(job.posted_on || Date.now()).toISOString(),
    employmentType: job.commitment,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      sameAs: job.website,
      logo: job.image_url,
    },
    jobLocation: job.remote
      ? { "@type": "Place", name: "Remote" }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.work_loc,
            addressCountry: "IN",
          },
        },
    baseSalary: job.compensation && {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        value: job.compensation,
        unitText: "YEAR",
      },
    },
  };
}

/* -------------------- DATA FETCH -------------------- */
async function getJob(id) {
  try {
    const jobId = id.split("-").pop();

    const res = await fetch(`${API_URL}/api/v1/job/jobs/${jobId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/* -------------------- SEO (MODERN) -------------------- */
export async function generateMetadata({ params }) {
  const { id } = await params; // ✅ unwrap Promise

  const job = await getJob(id);

  if (!job) {
    return {
      title: "Job Not Found",
      description: "This job may have expired or is unavailable.",
    };
  }

  return {
    title: `${job.job_title} at ${job.company_name}`,
    description: `${job.company_name} is hiring for ${job.job_title}. Apply now.`,
    openGraph: {
      title: `${job.job_title} at ${job.company_name}`,
      description: `${job.company_name} is hiring for ${job.job_title}.`,
      type: "website",
    },
    other: {
      "application/ld+json": JSON.stringify(buildJobSchema(job)),
    },
  };
}

/* -------------------- PAGE -------------------- */
export default async function Page({ params }) {
  const { id } = await params; // ✅ required

  const job = await getJob(id);
  if (!job) return <NotFound />;

  return (
    <div className="max-w-[73.75rem] mx-auto px-4 mb-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <a
            href={`https://${job.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-20 h-20 bg-zinc-100 rounded-md"
          >
            {job.image_url && (
              <img
                src={job.image_url}
                alt={job.company_name}
                className="w-full h-full object-cover"
              />
            )}
          </a>

          <h3 className="mt-4 text-lg font-medium">{job.company_name}</h3>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            {job.job_title}
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Left */}
          <div className="flex-1 bg-background rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge>
                {job.work_loc}
                {job.remote && " | Remote"}
              </Badge>
              <Badge>{job.commitment}</Badge>
              {job.compensation && <Badge>${job.compensation}</Badge>}
              {job.level && <Badge>{job.level}</Badge>}
            </div>

            <div className="text-sm leading-7 text-zinc-900 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Right */}
          <div className="md:w-[30%] sticky top-6 space-y-4">
            <a
              href={`${job.job_link}?utm_source=getjobs.today`}
              className="block bg-accent-blue-2 text-white rounded-2xl p-4 text-center font-medium"
            >
              <h3 className="bg-accent-blue-1 text-center w-[100%] p-[1rem] rounded-[12px] font-medium">
                Apply for this job
              </h3>
            </a>

            <EmailCollector isHome />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- UI -------------------- */
const Badge = ({ children }) => (
  <span className="bg-[#DBDBDB] px-3 py-1 rounded-lg text-sm">{children}</span>
);
