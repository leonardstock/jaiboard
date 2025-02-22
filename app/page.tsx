"use client";

import ListElement from "@/components/ListElement";
import LoadingIndicator from "@/components/LoadingIndicator";
import Select from "@/components/Select";
import { getApolloClient } from "@/graphql/apollo-client";
import { Job } from "@/graphql/generated";
import { GET_ALL_JOBS } from "@/graphql/queries";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface GetJobsResponse {
    jobs: Job[];
}

export default function Home() {
    const apolloClient = getApolloClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await apolloClient.query<GetJobsResponse>({
                query: GET_ALL_JOBS,
            });

            if (error) {
                setJobs([]);
                setIsLoading(false);
                return;
            }

            setJobs(data.jobs);
            setIsLoading(false);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log("search term changed");
    }, [searchTerm]);

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32'>
                    <main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-25'>
                        <div className='text-center'>
                            <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
                                <span className='block'>Welcome to</span>
                                the best way to find your next job in AI
                            </h1>
                            <p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl'></p>
                        </div>
                    </main>
                </div>
            </div>

            <div className='flex md:flex-row flex-col md:items-center gap-2 max-w-7xl mx-auto p-4 md:justify-end'>
                <div className='border-2 border-gray-200 rounded-lg px-4 py-2 shadow-md flex items-center gap-2'>
                    <Search className='h-5 w-5 text-gray-500' />
                    <input
                        className='focus:outline-none'
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* City */}
                <Select options={["All", "Berlin", "Munich", "London"]} />
                {/* Company */}
                <Select options={["All", "Google"]} />
                {/* last x days usw */}
                <Select options={["All", "Last 24 hours"]} />
                {/* Job titles */}
                <Select options={["All", "Frontend", "Backend"]} />
                {/* tag */}
                <Select options={["All", "Python", "React"]} />
            </div>
            <div className='flex flex-col gap-4 p-4 max-w-7xl mx-auto'>
                {isLoading && (
                    <div className='mt-10'>
                        <LoadingIndicator />
                    </div>
                )}
                {!isLoading && jobs.length === 0 && (
                    <div className='w-full text-center mt-10 text-gray-500 text-xl'>
                        No jobs currently, sorry!
                    </div>
                )}
                {jobs.map((data: Job) => {
                    return (
                        <ListElement
                            key={data.id}
                            id={data.id}
                            title={data.title}
                            company={data.company}
                            location={data.location}
                            image={data.image}
                            tags={data.tags}
                            time={data.time}
                        />
                    );
                })}
            </div>
            <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
        </div>
    );
}
