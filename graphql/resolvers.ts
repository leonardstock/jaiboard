/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job, JobInput } from "./generated";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

// Transform Supabase snake_case to GraphQL camelCase
const transformJob = (job: any): Job => {
    // Make sure we're accessing the right property
    const employmentType =
        job.employment_type ||
        job["employment_type"] ||
        job.employmentType ||
        job.employmenttype ||
        "Full-time";

    return {
        id: job.id,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        image: job.image,
        tags: job.tags,
        time: job.time,
        employmentType: employmentType,
        salaryRange: job.salary_range,
        requirements: job.requirements,
        benefits: job.benefits,
        applicationDeadline: job.application_deadline,
        experienceLevel: job.experience_level,
        companyDescription: job.company_description,
        companySize: job.company_size,
        remote: job.remote,
        url: job.url,
        applicationProcess: job.application_process,
        contactEmail: job.contact_email,
        featured: job.featured,
        status: job.status,
        submissionId: job.submission_id,
    };
};

// Transform GraphQL camelCase to Supabase snake_case
const transformInput = (input: JobInput) => ({
    title: input.title,
    company: input.company,
    description: input.description,
    location: input.location,
    image: input.image,
    tags: input.tags,
    time: input.time,
    employment_type: input.employmentType,
    salary_range: input.salaryRange,
    requirements: input.requirements,
    benefits: input.benefits,
    application_deadline: input.applicationDeadline,
    experience_level: input.experienceLevel,
    company_description: input.companyDescription,
    company_size: input.companySize,
    remote: input.remote,
    url: input.url,
    application_process: input.applicationProcess,
    contact_email: input.contactEmail,
    featured: input.featured,
    status: input.status,
    submission_id: "",
});

export const resolvers = {
    Query: {
        jobs: async () => {
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
                .order("featured", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            return data?.map((job) => transformJob(job)) || [];
        },
        job: async (_: any, { id }: { id: string }) => {
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw new Error(error.message);
            return transformJob(data);
        },
        jobsByTag: async (_: any, { tag }: { tag: string }) => {
            // Assuming tags are stored as an array in Supabase
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
                .contains("tags", [tag]);

            if (error) throw new Error(error.message);
            return data?.map(transformJob) || [];
        },

        jobsByCompany: async (_: any, { company }: { company: string }) => {
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
                .ilike("company", `%${company}%`);

            if (error) throw new Error(error.message);
            return data?.map(transformJob) || [];
        },

        searchJobs: async (
            _: any,
            {
                keyword = "",
                location = "",
                company = "",
                timePosted = "",
                tags = [] as string[],
            }
        ) => {
            let query = supabase
                .from("jobs")
                .select("*")
                .eq("status", "ACTIVE");

            if (keyword.trim()) {
                query = query.or(
                    `title.ilike.%${keyword}%, description.ilike.%${keyword}%, company.ilike.%${keyword}%, location.ilike.%${keyword}%`
                );
            }

            if (location && location !== "All") {
                query = query.ilike("location", `%${location}%`);
            }

            if (company && company !== "All") {
                query = query.ilike("company", `%${company}%`);
            }

            if (timePosted && timePosted !== "All") {
                const timeFilter = new Date();
                if (timePosted === "Last 24 hours") {
                    timeFilter.setDate(timeFilter.getDate() - 1);
                    query = query.gte("time", timeFilter.toISOString());
                }
                if (timePosted === "Last week") {
                    timeFilter.setDate(timeFilter.getDate() - 7);
                    query = query.gte("time", timeFilter.toISOString());
                }
            }

            if (tags.length > 0 && !tags.includes("All")) {
                query = query.contains("tags", tags);
            }

            const { data, error } = await query;
            if (error) throw new Error(error.message);
            return data?.map(transformJob) || [];
        },

        getFilterOptions: async () => {
            const { data: locationsData } = await supabase
                .from("jobs")
                .select("location")
                .not("location", "is", null)
                .eq("status", "ACTIVE");

            const { data: companiesData } = await supabase
                .from("jobs")
                .select("company")
                .not("company", "is", null)
                .eq("status", "ACTIVE");

            const { data: tagsData } = await supabase
                .from("jobs")
                .select("tags")
                .not("tags", "is", null)
                .eq("status", "ACTIVE");

            const locations = [
                ...new Set(locationsData?.map((item) => item.location)),
            ];
            const companies = [
                ...new Set(companiesData?.map((item) => item.company)),
            ];
            const allTags = tagsData?.reduce((acc: string[], item) => {
                return acc.concat(item.tags);
            }, []);
            const tags = [...new Set(allTags)];

            return {
                locations: ["All", ...locations].sort(),
                companies: ["All", ...companies].sort(),
                tags: ["All", ...tags].sort(),
            };
        },
    },
    Mutation: {
        createJob: async (
            _: any,
            { input, submissionId }: { input: JobInput; submissionId: string }
        ) => {
            const supabaseInput = transformInput(input);
            supabaseInput.submission_id = submissionId;
            const { data, error } = await supabase
                .from("jobs")
                .insert([supabaseInput])
                .select()
                .single();

            if (error) throw new Error(error.message);

            return transformJob(data);
        },
        updateJobStatus: async (
            _: any,
            { submissionId, status }: { submissionId: string; status: string }
        ) => {
            const { data, error } = await supabase
                .from("jobs")
                .update({ status })
                .eq("submission_id", submissionId)
                .select();

            if (error) throw new Error(error.message);

            return transformJob(data[0]);
        },
    },
};
