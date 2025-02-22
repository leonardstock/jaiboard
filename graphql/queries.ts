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
        }
    }
`;
