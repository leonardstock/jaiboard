"use client";

import ListElement from "@/components/ListElement";
import LoadingIndicator from "@/components/LoadingIndicator";
import Select from "@/components/Select";
import { getApolloClient } from "@/graphql/apollo-client";
import { FilterOption, Job } from "@/graphql/generated";
import { GET_FILTER_OPTIONS, SEARCH_JOBS } from "@/graphql/queries";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

interface SearchJobsResponse {
    searchJobs: Job[];
}

interface FilterState {
    location: string;
    company: string;
    timePosted: string;
    tags: string;
}

export default function Home() {
    const apolloClient = getApolloClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOptions, setFilterOptions] = useState<FilterOption>({
        locations: [],
        companies: [],
        tags: [],
    });

    const [filters, setFilters] = useState<FilterState>({
        location: "All",
        company: "All",
        timePosted: "All",
        tags: "All",
    });

    const searchJobs = async (searchTerm: string, filters: FilterState) => {
        setIsLoading(true);

        try {
            const { data } = await apolloClient.query<SearchJobsResponse>({
                query: SEARCH_JOBS,
                variables: {
                    keyword: searchTerm,
                    location: filters.location,
                    company: filters.company,
                    timePosted: filters.timePosted,
                    tags: filters.tags,
                },
                fetchPolicy: "network-only",
            });
            setJobs(data.searchJobs);
        } catch (error) {
            console.error("Search error:", error);
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSearch = debounce(searchJobs, 300);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const { data } = await apolloClient.query({
                    query: GET_FILTER_OPTIONS,
                });

                setFilterOptions(data.getFilterOptions);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        debouncedSearch(searchTerm, filters);

        // Cleanup function to cancel pending debounced calls
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, filters]);

    const handleFilterChange = (
        filterName: keyof FilterState,
        value: string
    ) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

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

            <div className='flex md:flex-row flex-col md:items-end gap-2 max-w-7xl mx-auto p-4 md:justify-end'>
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
                <Select
                    options={filterOptions.locations}
                    label='City'
                    value={filters.location}
                    onChange={(value) => handleFilterChange("location", value)}
                />
                <Select
                    options={filterOptions.companies}
                    label='Company'
                    value={filters.company}
                    onChange={(value) => handleFilterChange("company", value)}
                />
                <Select
                    options={["All", "Last 24 hours", "Last week"]}
                    label='Time posted'
                    value={filters.timePosted}
                    onChange={(value) =>
                        handleFilterChange("timePosted", value)
                    }
                />
                <Select
                    options={filterOptions.tags}
                    label='Tags'
                    value={filters.tags}
                    onChange={(value) => handleFilterChange("tags", value)}
                />
            </div>
            <div className='flex flex-col gap-4 p-4 max-w-7xl mx-auto'>
                {!isLoading && jobs.length === 0 && (
                    <div className='w-full text-center mt-10 text-gray-500 text-xl'>
                        No jobs currently, sorry!
                    </div>
                )}
                {isLoading && (
                    <div className='mt-10'>
                        <LoadingIndicator />
                    </div>
                )}
                {!isLoading &&
                    jobs.map((data: Job) => {
                        if (data.status === "ACTIVE") {
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
                                    featured={data.featured}
                                />
                            );
                        }
                    })}
            </div>
            <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
        </div>
    );
}
