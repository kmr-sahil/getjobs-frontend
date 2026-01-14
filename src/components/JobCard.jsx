import React from "react";
import Link from "next/link";

function JobCard({
  jobTitle,
  companyName,
  isRemote,
  loc,
  id,
  img,
  jobLink,
  commitment,
}) {
  return (
    <div className="w-[100%] flex justify-between items-center px-[8px] sm:px-[24px] py-[8px] sm:py-[1rem] rounded-[12px] hover:bg-background hover:bg-opacity-50">
      <Link
        href={`/job/${(jobTitle || "").replace(/\s+/g, "-").toLowerCase()}-${(
          companyName || ""
        )
          .replace(/\s+/g, "-")
          .toLowerCase()}-${id || ""}`}
        target="_blank"
        className="flex flex-grow items-center justify-start gap-[1rem]"
      >
        <div className="w-8 h-8 sm:w-14 sm:h-14 bg-primary/10 rounded-[4px] overflow-hidden flex-shrink-0">
          {img ? (
            <img
              src={img}
              alt="company_logo"
              className="w-full h-full object-cover"
              style={{ objectFit: "cover" }} // You can set object-fit through inline styles
            />
          ) : (
            <span className="flex items-center justify-center h-full text-white">
              {companyName?.[0]}
            </span> // Adjusted the padding to center vertically
          )}
        </div>

        <div className="flex flex-col justify-start items-start ">
          <h3 className="text-[0.85rem] sm:text-[20px] font-medium text-base-1">
            {jobTitle}
          </h3>

          <h5 className="text-[12px] sm:text-[1rem] font-normal text-base-2">
            {companyName}{" "}
            <span>
              <span className="font-extrabold">·</span>{" "}
              {isRemote ? "Remote" : `${loc}`}
            </span>{" "}
            <span>
              <span className="font-extrabold">·</span>{" "}
              {commitment ? commitment : ""}
            </span>
          </h5>
        </div>
      </Link>

      <div className="hidden w-[8.5rem] md:w-[15rem] md:flex items-center justify-center gap-[8px] md:gap-[1rem]">
        <Link
          href={`/job/${id}`}
          target="_blank"
          className="button-secondary text-[12px] md:text-[1rem]"
        >
          View
        </Link>

        <Link
          href={`${jobLink}?utm_source=getjobs.today&utm_medium=organic`}
          target="_blank"
          className="button-primary text-[12px] md:text-[1rem] whitespace-nowrap"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
