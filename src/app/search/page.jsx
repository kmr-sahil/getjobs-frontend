"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Search from "@/components/Search";
import JobCard from "@/components/JobCard";
import useDebounce from "@/hooks/useDebounce";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}

function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [load, setLoad] = useState(false);
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loc, setLoc] = useState(searchParams.get("loc") || "");
  const [page, setPage] = useState(1);

  const [remote, setRemote] = useState(searchParams.get("remote") === "true");

  const [filters, setFilters] = useState({
    level: searchParams.get("level") || "",
    commitment: searchParams.get("commitment") || "",
    categories: searchParams.get("categories") || "",
  });

  const debouncedSearch = useDebounce(search, 500);
  const debouncedLoc = useDebounce(loc, 500);

  const buildQueryParams = (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== false
      ) {
        searchParams.set(key, String(value));
      }
    });

    return searchParams.toString();
  };

  useEffect(() => {
    const params = buildQueryParams({
      page,
      search: debouncedSearch,
      loc: debouncedLoc,
      remote,
      commitment: filters.commitment,
      level: filters.level,
      categories: filters.categories,
    });

    router.replace(`?${params}`, { scroll: false });
  }, [debouncedSearch, debouncedLoc, remote, filters, page]);

  useEffect(() => {
    const controller = new AbortController();

    async function getJobs() {
      try {
        setLoad(true);

        const { level, commitment, categories } = filters;

        const url = `${process.env.NEXT_PUBLIC_BACK_MAIN}/api/v1/job/list?page=${page}&search=${debouncedSearch}&loc=${debouncedLoc}&remote=${remote ? "true" : "false"}&commitment=${commitment}&level=${level}&categories=${categories}`;

        const response = await axios.get(url, {
          signal: controller.signal,
        });

        setPosts((prev) =>
          page === 1 ? response.data.all : [...prev, ...response.data.all],
        );
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      } finally {
        setLoad(false);
      }
    }

    getJobs();

    return () => controller.abort();
  }, [debouncedSearch, debouncedLoc, page, remote, filters]);

  const resetPagination = () => {
    setPage(1);
    setPosts([]);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  const handleLocationChange = (value) => {
    setLoc(value);
    resetPagination();
  };

  const handleRemoteChange = () => {
    setRemote((prev) => !prev);
    resetPagination();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const handleShowMoreResults = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-[73.75rem] min-h-screen mx-auto flex flex-col items-center justify-center gap-[2rem] px-[1rem]">
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
          <p>{load ? "Loading..." : ""}</p>
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
