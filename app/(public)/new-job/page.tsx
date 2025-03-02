"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { getApolloClient } from "@/graphql/apollo-client";
import { CREATE_NEW_JOB } from "@/graphql/queries";
import { CreateJobMutation } from "@/graphql/generated";
import { v4 } from "uuid";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const apolloClient = getApolloClient();

const generateRandomId = () => {
    return v4();
};

export default function PostJobPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        location: "",
        image: "",
        tags: "",
        employmentType: "Full-time",
        salaryRange: "",
        requirements: "",
        benefits: "",
        applicationDeadline: "",
        experienceLevel: "Mid-level",
        companyDescription: "",
        companySize: "",
        remote: false,
        url: "",
        applicationProcess: "",
        contactEmail: "",
        featured: false,
        status: "PENDING",
    });

    const employmentTypes = [
        "Full-time",
        "Part-time",
        "Contract",
        "Freelance",
        "Internship",
    ];

    const experienceLevels = [
        "Entry-level",
        "Mid-level",
        "Senior",
        "Lead",
        "Executive",
    ];

    const handleInputChange = (
        e:
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
            | ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleArrayInputChange = (
        e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Process tags, requirements and benefits into arrays
        const processedData = {
            ...formData,
            tags: formData.tags.split(",").map((tag) => tag.trim()),
            requirements: formData.requirements
                .split("\n")
                .filter((req) => req.trim() !== ""),
            benefits: formData.benefits
                .split("\n")
                .filter((benefit) => benefit.trim() !== ""),
            time: new Date().toISOString(),
        };

        try {
            const submissionId = generateRandomId();

            const { errors } = await apolloClient.mutate<CreateJobMutation>({
                mutation: CREATE_NEW_JOB,
                variables: { input: processedData, submissionId },
            });

            if (errors) {
                console.error("Error posting job:", errors);
            }

            const response = await axios.post("/api/stripe", {
                featured: formData.featured,
                submission_id: submissionId,
            });

            const { sessionId } = await response.data;
            const stripe = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
            );
            await stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32'>
                    <main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-25'>
                        <div className='text-center'>
                            <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
                                <span className='block'>Post a Job</span>
                                <span className='block text-indigo-600 text-2xl sm:text-3xl mt-2'>
                                    Find the best AI talent for your team
                                </span>
                            </h1>
                            <p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl'>
                                Create a detailed job posting to attract
                                qualified candidates in artificial intelligence,
                                machine learning, and related fields.
                            </p>
                        </div>
                    </main>
                </div>
            </div>

            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
                <form onSubmit={handleSubmit} className='space-y-8'>
                    {/* Job Basics Section */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                        <h2 className='text-xl font-bold text-gray-900 mb-6'>
                            Job Basics
                        </h2>

                        <div className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='title'
                                    className='block text-sm font-medium text-gray-700'>
                                    Job Title{" "}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='e.g., Senior Machine Learning Engineer'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='company'
                                    className='block text-sm font-medium text-gray-700'>
                                    Company Name{" "}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='company'
                                    name='company'
                                    required
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='e.g., AI Innovations Inc.'
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        htmlFor='location'
                                        className='block text-sm font-medium text-gray-700'>
                                        Location{" "}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        id='location'
                                        name='location'
                                        required
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='e.g., San Francisco, CA'
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor='employmentType'
                                        className='block text-sm font-medium text-gray-700'>
                                        Employment Type{" "}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        id='employmentType'
                                        name='employmentType'
                                        required
                                        value={formData.employmentType}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'>
                                        {employmentTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        htmlFor='experienceLevel'
                                        className='block text-sm font-medium text-gray-700'>
                                        Experience Level
                                    </label>
                                    <select
                                        id='experienceLevel'
                                        name='experienceLevel'
                                        value={formData.experienceLevel}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'>
                                        {experienceLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor='salaryRange'
                                        className='block text-sm font-medium text-gray-700'>
                                        Salary Range
                                    </label>
                                    <input
                                        type='text'
                                        id='salaryRange'
                                        name='salaryRange'
                                        value={formData.salaryRange}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='e.g., $120,000 - $150,000'
                                    />
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <input
                                    id='remote'
                                    name='remote'
                                    type='checkbox'
                                    checked={formData.remote}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='remote'
                                    className='ml-2 block text-sm text-gray-700'>
                                    Remote position available
                                </label>
                            </div>

                            <div>
                                <label
                                    htmlFor='tags'
                                    className='block text-sm font-medium text-gray-700'>
                                    Skills/Tags{" "}
                                    <span className='text-red-500'>*</span>{" "}
                                    <span className='text-xs text-gray-500'>
                                        (comma separated, these will be
                                        individual hashtags on your LinkedIn
                                        post)
                                    </span>
                                </label>
                                <input
                                    type='text'
                                    id='tags'
                                    name='tags'
                                    required
                                    value={formData.tags}
                                    onChange={handleArrayInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='e.g., Python, TensorFlow, NLP, Computer Vision'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details Section */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                        <h2 className='text-xl font-bold text-gray-900 mb-6'>
                            Job Details
                        </h2>

                        <div className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='description'
                                    className='block text-sm font-medium text-gray-700'>
                                    Job Description{" "}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    id='description'
                                    name='description'
                                    rows={6}
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='Provide a detailed description of the role, responsibilities, and ideal candidate...'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='requirements'
                                    className='block text-sm font-medium text-gray-700'>
                                    Requirements{" "}
                                    <span className='text-xs text-gray-500'>
                                        (one per line)
                                    </span>
                                </label>
                                <textarea
                                    id='requirements'
                                    name='requirements'
                                    rows={4}
                                    value={formData.requirements}
                                    onChange={handleArrayInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='5+ years experience in machine learning&#10;Masters or PhD in Computer Science&#10;Experience with PyTorch and TensorFlow'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='benefits'
                                    className='block text-sm font-medium text-gray-700'>
                                    Benefits{" "}
                                    <span className='text-xs text-gray-500'>
                                        (one per line)
                                    </span>
                                </label>
                                <textarea
                                    id='benefits'
                                    name='benefits'
                                    rows={4}
                                    value={formData.benefits}
                                    onChange={handleArrayInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='Competitive salary&#10;Health, dental, and vision insurance&#10;401(k) matching&#10;Flexible work hours'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='applicationProcess'
                                    className='block text-sm font-medium text-gray-700'>
                                    Application Process
                                </label>
                                <textarea
                                    id='applicationProcess'
                                    name='applicationProcess'
                                    rows={3}
                                    value={formData.applicationProcess}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='Describe your application and interview process...'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='applicationDeadline'
                                    className='block text-sm font-medium text-gray-700'>
                                    Application Deadline (this is also when your
                                    ad will expire)
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    required
                                    id='applicationDeadline'
                                    name='applicationDeadline'
                                    value={formData.applicationDeadline}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                        <h2 className='text-xl font-bold text-gray-900 mb-6'>
                            Company Information
                        </h2>

                        <div className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='companyDescription'
                                    className='block text-sm font-medium text-gray-700'>
                                    Company Description
                                </label>
                                <textarea
                                    id='companyDescription'
                                    name='companyDescription'
                                    rows={4}
                                    value={formData.companyDescription}
                                    onChange={handleInputChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                    placeholder='Tell potential candidates about your company...'
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        htmlFor='companySize'
                                        className='block text-sm font-medium text-gray-700'>
                                        Company Size
                                    </label>
                                    <input
                                        type='text'
                                        id='companySize'
                                        name='companySize'
                                        value={formData.companySize}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='e.g., 50-100 employees'
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor='image'
                                        className='block text-sm font-medium text-gray-700'>
                                        Company Logo URL
                                    </label>
                                    <input
                                        type='url'
                                        id='image'
                                        name='image'
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='https://example.com/logo.png'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Submission Section */}
                    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                        <h2 className='text-xl font-bold text-gray-900 mb-6'>
                            Contact & Submission
                        </h2>

                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        htmlFor='url'
                                        className='block text-sm font-medium text-gray-700'>
                                        Job URL{" "}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='url'
                                        id='url'
                                        name='url'
                                        required
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='https://example.com/careers/apply'
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor='contactEmail'
                                        className='block text-sm font-medium text-gray-700'>
                                        Contact Email
                                    </label>
                                    <input
                                        type='email'
                                        id='contactEmail'
                                        name='contactEmail'
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3'
                                        placeholder='careers@example.com'
                                    />
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <input
                                    id='featured'
                                    name='featured'
                                    type='checkbox'
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='featured'
                                    className='ml-2 block text-sm text-gray-700'>
                                    Feature this job posting (+5$){" "}
                                    <span className='text-sm'>*</span>
                                </label>
                            </div>
                            <div className='text-sm text-gray-500'>
                                <span className='text-sm'>*</span> Your posting
                                will be displayed at the top of the list and
                                with a colorful ring around it. Additionally, it
                                will be highlighted that you are hiring urgently
                                on the LinkedIn post which is automatically
                                created for every job on our page.{" "}
                                <Link
                                    href='https://www.linkedin.com/company/jaiboard/posts'
                                    className='underline'>
                                    Have a look!
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end space-x-4'>
                        <Link
                            href='/'
                            className='px-6 py-3 bg-white text-gray-700 font-medium rounded-md shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                            Cancel
                        </Link>
                        <button
                            type='submit'
                            disabled={loading}
                            className='px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {loading ? "Loading..." : "Post Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
