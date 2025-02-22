export const typeDefs = `#graphql
    type Query {
        jobs: [Job!]!
        job(id: ID!): Job!
        jobsByTag(tag: String!): [Job!]!
        jobsByCompany(company: String!): [Job!]!
        searchJobs(
            keyword: String
            location: String
            company: String
            tags: [String!]
            timePosted: String
        ): [Job!]!
        getFilterOptions: FilterOption!
    }

    type Mutation {
        saveJob(jobId: ID!, userId: ID!): Boolean
        applyForJob(jobId: ID!, userId: ID!, resumeUrl: String!): Boolean
        createJob(input: JobInput!, submissionId: String!): Job
        updateJob(jobId: ID!, input: JobInput!): Job
        updateJobStatus(submissionId: String!, status: String!): Job
    }

    type FilterOption {
        locations: [String!]!
        companies: [String!]!
        tags: [String!]!
    }

    type Job {
        id: ID!
        title: String!
        company: String!
        description: String!
        location: String!
        image: String
        tags: [String!]!
        time: String!
        employmentType: String!
        salaryRange: String
        requirements: [String!]
        benefits: [String!]
        applicationDeadline: String
        experienceLevel: String
        companyDescription: String
        companySize: String
        remote: Boolean
        url: String!
        applicationProcess: String
        contactEmail: String
        featured: Boolean!
        status: String!
        submissionId: String!
    }

    input JobInput {
        title: String!
        company: String!
        description: String!
        location: String!
        image: String
        tags: [String!]!
        time: String!
        employmentType: String!
        salaryRange: String
        requirements: [String!]
        benefits: [String!]
        applicationDeadline: String
        experienceLevel: String
        companyDescription: String
        companySize: String
        remote: Boolean
        url: String!
        applicationProcess: String
        contactEmail: String
        featured: Boolean
        status: String!
    }

`;
