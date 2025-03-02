import { gql } from "@apollo/client";

export const GET_JOB_QUERY = gql`
    query GetJob($id: ID!) {
        job(id: $id) {
            id
            title
            description
            company
            tags
            location
            time
            url
            applicationDeadline
            applicationProcess
            benefits
            companyDescription
            companySize
            contactEmail
            employmentType
            experienceLevel
            featured
            remote
            salaryRange
            requirements
        }
    }
`;

export const GET_ALL_JOBS = gql`
    query GetAllJobs {
        jobs {
            id
            title
            company
            tags
            location
            time
            employmentType
            featured
            status
        }
    }
`;

export const SEARCH_JOBS = gql`
    query SearchJobs(
        $keyword: String
        $location: String
        $company: String
        $timePosted: String
        $tags: [String!]
    ) {
        searchJobs(
            keyword: $keyword
            location: $location
            company: $company
            timePosted: $timePosted
            tags: $tags
        ) {
            id
            title
            company
            tags
            location
            time
            employmentType
            featured
            status
        }
    }
`;

export const CREATE_NEW_JOB = gql`
    mutation CreateJob($input: JobInput!, $submissionId: String!) {
        createJob(input: $input, submissionId: $submissionId) {
            id
        }
    }
`;

export const UPDATE_JOB_STATUS = gql`
    mutation UpdateJobStatus($submissionId: String!, $status: String!) {
        updateJobStatus(submissionId: $submissionId, status: $status) {
            id
            company
            title
            location
            remote
            featured
        }
    }
`;

export const GET_FILTER_OPTIONS = gql`
    query GetFilterOptions {
        getFilterOptions {
            locations
            companies
            tags
        }
    }
`;
