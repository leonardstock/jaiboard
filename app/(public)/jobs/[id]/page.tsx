import { getApolloClient } from "@/graphql/apollo-client";
import { Job } from "@/graphql/generated";
import { GET_JOB_QUERY } from "@/graphql/queries";
import Link from "next/link";
import Image from "next/image";

interface GetJobResponse {
    job: Job;
}

const JobPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const client = getApolloClient();
    const { data, error } = await client.query<GetJobResponse>({
        query: GET_JOB_QUERY,
        variables: { id: id },
    });

    if (error) return <div>Error loading job: {error.message}</div>;
    const job = data?.job;

    if (!job) return <div>No job found for ID {id}</div>;

    // Format date
    const formattedDate = new Date(job.time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto'>
                {/* Header section */}
                <div className='relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32'>
                    <main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-25'>
                        <div className='flex items-center mb-6'>
                            <Link
                                href='/'
                                className='text-indigo-600 hover:text-indigo-800 font-medium'>
                                ← Back to all jobs
                            </Link>
                        </div>

                        {/* Company logo and basic info */}
                        <div className='flex flex-col md:flex-row items-start gap-6 border-b border-gray-200 pb-10'>
                            {job.image && (
                                <div className='flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden'>
                                    <Image
                                        src={job.image}
                                        alt={`${job.company} logo`}
                                        className='w-full h-full object-contain'
                                    />
                                </div>
                            )}

                            <div className='flex-1'>
                                <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl'>
                                    {job.title}
                                </h1>
                                <div className='mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6'>
                                    <p className='text-xl font-semibold text-gray-800'>
                                        {job.company}
                                    </p>
                                    <p className='text-gray-600'>
                                        {job.location}
                                    </p>
                                    <p className='text-gray-500'>
                                        Posted on {formattedDate}
                                    </p>
                                </div>

                                <div className='mt-4 flex flex-wrap gap-2'>
                                    {Array.isArray(job.tags) &&
                                        job.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className='px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full'>
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                            </div>

                            <div className='mt-6 md:mt-0'>
                                <div className='flex flex-col gap-4'>
                                    <Link
                                        href={job.url}
                                        className='self-end w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                                        Go to job site
                                    </Link>
                                    <span className='text-sm text-gray-500 '>
                                        When you apply, please tell them that
                                        you found this job here 😊
                                    </span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Job details section */}
            <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main content */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white p-6 rounded-lg shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                                Job Description
                            </h2>
                            <div className='prose prose-indigo max-w-none'>
                                {job.description ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: job.description,
                                        }}
                                    />
                                ) : (
                                    <p className='text-gray-600'>
                                        No description provided for this
                                        position.
                                    </p>
                                )}
                            </div>

                            <div className='mt-10'>
                                <h3 className='text-xl font-bold text-gray-900 mb-4'>
                                    Requirements
                                </h3>
                                {job.requirements ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: job.requirements,
                                        }}
                                    />
                                ) : (
                                    <p className='text-gray-600'>
                                        No specific requirements listed.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white p-6 rounded-lg shadow-sm sticky top-10'>
                            <h3 className='text-lg font-medium text-gray-900 mb-4'>
                                Job Details
                            </h3>

                            <div className='space-y-4'>
                                <div>
                                    <h4 className='text-sm font-medium text-gray-500'>
                                        Company
                                    </h4>
                                    <p className='mt-1 text-gray-900'>
                                        {job.company}
                                    </p>
                                </div>

                                <div>
                                    <h4 className='text-sm font-medium text-gray-500'>
                                        Location
                                    </h4>
                                    <p className='mt-1 text-gray-900'>
                                        {job.location}
                                    </p>
                                </div>

                                <div>
                                    <h4 className='text-sm font-medium text-gray-500'>
                                        Employment Type
                                    </h4>
                                    <p className='mt-1 text-gray-900'>
                                        {job.employmentType || "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <h4 className='text-sm font-medium text-gray-500'>
                                        Salary Range
                                    </h4>
                                    <p className='mt-1 text-gray-900'>
                                        {job.salaryRange || "Not disclosed"}
                                    </p>
                                </div>

                                {job.benefits && job.benefits.length > 0 && (
                                    <div>
                                        <h3 className='text-xl font-bold text-gray-900 mb-4'>
                                            Benefits
                                        </h3>
                                        <ul className='list-disc pl-5 space-y-2'>
                                            {job.benefits.map(
                                                (benefit, index) => (
                                                    <li
                                                        key={index}
                                                        className='text-gray-700'>
                                                        {benefit}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {job.applicationDeadline && (
                                    <div>
                                        <h4 className='text-sm font-medium text-gray-500'>
                                            Application Deadline
                                        </h4>
                                        <p className='mt-1 text-gray-900'>
                                            {new Date(
                                                job.applicationDeadline
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {job.experienceLevel && (
                                    <div>
                                        <h4 className='text-sm font-medium text-gray-500'>
                                            Experience Level
                                        </h4>
                                        <p className='mt-1 text-gray-900'>
                                            {job.experienceLevel}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPage;
