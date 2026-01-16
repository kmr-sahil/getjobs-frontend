"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation"; // Import useSearchParams and usePathname
import axios from "axios";
import Search from "@/components/Search";
import JobCard from "@/components/JobCard";
import useDebounce from "@/hooks/useDebounce";
import Loader from "@/components/Loader";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <JobSearchComponent />
    </Suspense>
  );
}

function JobSearchComponent() {
  const searchParams = useSearchParams(); // Use useSearchParams to read query params
  const pathname = usePathname(); // Use usePathname to get the current path

  const [load, setLoad] = useState(false);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || ""); // Initialize from query params
  const [loc, setLoc] = useState(searchParams.get("loc") || ""); // Initialize from query params
  const [page, setPage] = useState(1);
  const [searchChanged, setSearchChanged] = useState(false);
  const [remote, setRemote] = useState(
    searchParams.get("remote") === "true" || false
  ); // Initialize from query params
  const [filters, setFilters] = useState({
    level: searchParams.get("level") || "",
    commitment: searchParams.get("commitment") || "",
    categories: searchParams.get("categories") || "",
  });
  const debouncedSearchTerm = useDebounce(search, 500);
  const debouncedLoc = useDebounce(loc, 500);

  useEffect(() => {
    // Update the URL with query parameters manually
    const params = new URLSearchParams({
      search: debouncedSearchTerm || "",
      loc: debouncedLoc || "",
      remote: remote || "",
      commitment: filters.commitment || "",
      level: filters.level || "",
      categories: filters.categories || "",
      page: page || 1,
    });
    window.history.replaceState(null, "", `${pathname}?${params}`);
  }, [debouncedSearchTerm, debouncedLoc, remote, filters, page, pathname]);

  useEffect(() => {
    async function getJob() {
      try {
        setLoad(true);
        const { level, commitment, categories } = filters;
        const url = `${process.env.NEXT_PUBLIC_BACK_MAIN}/api/v1/job/list?page=${page}&search=${debouncedSearchTerm}&loc=${debouncedLoc}&remote=${remote}&commitment=${commitment}&level=${level}&categories=${categories}`;
        const response = await axios.get(url);
        setPosts((prevPosts) => [...prevPosts, ...response.data.all]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    }

    getJob();
  }, [debouncedSearchTerm, debouncedLoc, page, searchChanged, remote, filters]);

  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  const handleRemoteChange = () => {
    setRemote(!remote);
    resetPagination();
  };

  const handleLocationChange = (value) => {
    setLoc(value);
    resetPagination();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const resetPagination = () => {
    setPage(1);
    setPosts([]);
    setSearchChanged(true);
  };

  const handleShowMoreResults = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="max-w-[73.75rem] mx-auto flex flex-col items-center justify-center gap-[2rem] px-[1rem]">
  

      <div className="flex flex-col gap-[2rem] sm:px-[20px]">
        <div className="w-[100%] text-center flex flex-col items-center justify-center gap-[1rem]">
          <h1 className="text-[2.5rem] md:text-[4rem] font-light leading-tight">
            <span className="font-medium">Get</span> your dream{" "}
            <span className="font-medium">job today</span>
          </h1>
          <h3 className="md:px-[4rem] text-[14px] md:text-[20px]">
            Boost your career growth by joining one of the latest growing
            companies. Browse through our immense library of jobs at the
            fastest-growing startups.
          </h3>
        </div>

        <Search
          setLocValue={handleLocationChange}
          setSearchValue={handleSearchChange}
          setRemoteValue={handleRemoteChange}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="w-[100%] flex flex-col justify-center items-center sm:px-[20px]">
        {posts.length > 0 ? (
          posts.map((job, index) => (
            <JobCard
              key={`${job.id}-${index}`}
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
          <p>{load ? "Loading..." : "No jobs found"}</p>
        )}
      </div>

      {posts.length > 0 && (
        <button
          className="px-[1rem] py-[0.5rem] bg-background text-[12px] rounded-[8px] font-light"
          onClick={handleShowMoreResults}
        >
          {load ? "Loading..." : "Show more results"}
        </button>
      )}
    </div>
  );
}
