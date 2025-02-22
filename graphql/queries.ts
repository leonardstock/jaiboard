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
        }
    }
`;

export const CREATE_NEW_JOB = gql`
    mutation CreateJob($input: JobInput!) {
        createJob(input: $input) {
            id
        }
    }
`;
