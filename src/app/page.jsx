
import Marquee from "@/components/Marquee";
import EmailCollector from "@/components/EmailCollector";
import LatestJobs from "@/components/LatestJobs";
import Button from "@/components/Button";
import BookmarkAlert from "@/components/BookmarkAlert";

export default function App() {
  return (
    <div className="relative max-w-[73.75rem] mx-auto flex flex-col items-center justify-center gap-[2rem] overflow-x-hidden mb-[2rem] px-[1rem]">
      <BookmarkAlert />
      <div className="z-10 w-[100%] text-center flex flex-col items-center justify-center gap-[1rem] mt-[1rem]">
        <h1 className="text-[2.5rem] md:text-[4rem] font-light leading-tight">
          <span className="font-medium">Find</span> the Best <span className="font-medium">Job Vacancies</span> Today
        </h1>

        <h3 className="sm:px-[4rem] text-sm md:text-[20px] sm:leading-[1.2rem] md:leading-[2rem] font-light">
          Browse the latest <strong className="font-medium">remote jobs, startup jobs, IT jobs, and high-paying opportunities</strong> from top companies. Get hired faster!
        </h3>

        <Button title="Explore Job Openings Now"></Button>
        <p className="text-base-2 text-[12px] md:text-[14px]">No Login Required – Apply Instantly</p>
      </div>

      <Marquee></Marquee>

      <div className="w-[100%] max-w-[73.75rem] md:px-[2rem] mx-auto flex flex-col items-start justify-start gap-[1rem]">
        <LatestJobs></LatestJobs>
      </div>

      <div className="w-[100%] md:p-[2rem]">
        <div className="relative overflow-hidden bg-background flex flex-col p-[1rem] md:p-[2rem] rounded-[1rem] gap-[0.35rem] md:gap-[1rem] text-base-1">
          <h1 className=" text-[1rem] md:text-[2rem] font-medium">
            Stay Updated on Top Hiring Trends
          </h1>

          <h5 className=" text-[12px] md:text-[1.2rem] w-[100%] md:w-[40%] mb-[2rem] font-light">
            Subscribe to get the latest updates on <strong className="font-medium">remote work, tech jobs, and high-paying job vacancies</strong>.
          </h5>

          <img
            src="/images/resume.png"
            alt="Resume for Job Applications"
            className="absolute hidden sm:block w-[15rem] md:w-[22rem] top-4 md:top-12 right-4 saturate-100  rotate-[15deg]"
          />

          <EmailCollector isHome={false}></EmailCollector>
        </div>
      </div>

      
    </div>
  );
}
