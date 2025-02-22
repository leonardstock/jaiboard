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
        "Unspecified";

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
});

export const resolvers = {
    Query: {
        jobs: async () => {
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
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

        searchJobs: async (_: any, { keyword }: { keyword: string }) => {
            const { data, error } = await supabase
                .from("jobs")
                .select("*")
                .or(`title.ilike.%${keyword}%, description.ilike.%${keyword}%`);

            if (error) throw new Error(error.message);
            return data?.map(transformJob) || [];
        },
    },
    Mutation: {
        createJob: async (_: any, { input }: { input: Job }) => {
            const supabaseInput = transformInput(input);
            const { data, error } = await supabase
                .from("jobs")
                .insert([supabaseInput])
                .select()
                .single();

            if (error) throw new Error(error.message);

            console.log(transformJob(data));
            return transformJob(data);
        },
    },
};
