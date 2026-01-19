import axios from "axios";

const baseUrl = "https://getjobs.today"; // Change to your actual domain

export default async function sitemap() {
  try {
    // Fetch job IDs using axios
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_MAIN}/api/v1/sitemap/jobs`);

    const jobIds = response.data.jobIds; // Access `data.jobIds`

    // Static pages
    const staticPages = [
      { url: "/", priority: 1.0 },
      { url: "/dashboard", priority: 0.8 },
      { url: "/contact", priority: 0.8 },
      { url: "/postjob", priority: 0.8 },
      //{ url: "/search", priority: 0.8 },
      { url: "/about-us", priority: 0.8 },
      { url: "/privacy-policy", priority: 0.8 },
      { url: "/business", priority: 0.8 },
      { url: "/company", priority: 0.8 },
      { url: "/pricing", priority: 0.8 },
      { url: "/terms-of-service", priority: 0.8 },
      { url: "/cancellation-refund-policy", priority: 0.8 },
      { url: "/forgotpassword", priority: 0.8 },
      { url: "/login", priority: 0.8 },
      { url: "/signup", priority: 0.8 },
    ];

    // Generate sitemap array
    return [
      ...staticPages.map(({ url, priority }) => ({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        priority,
      })),
      ...jobIds.map((id) => ({
        url: `${baseUrl}/job/${id}`,
        lastModified: new Date(),
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
