export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Job = {
  __typename?: 'Job';
  applicationDeadline: Maybe<Scalars['String']['output']>;
  applicationProcess: Maybe<Scalars['String']['output']>;
  benefits: Maybe<Array<Scalars['String']['output']>>;
  company: Scalars['String']['output'];
  companyDescription: Maybe<Scalars['String']['output']>;
  companySize: Maybe<Scalars['String']['output']>;
  contactEmail: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  employmentType: Scalars['String']['output'];
  experienceLevel: Maybe<Scalars['String']['output']>;
  featured: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  remote: Maybe<Scalars['Boolean']['output']>;
  requirements: Maybe<Array<Scalars['String']['output']>>;
  salaryRange: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type JobInput = {
  applicationDeadline: InputMaybe<Scalars['String']['input']>;
  applicationProcess: InputMaybe<Scalars['String']['input']>;
  benefits: InputMaybe<Array<Scalars['String']['input']>>;
  company: Scalars['String']['input'];
  companyDescription: InputMaybe<Scalars['String']['input']>;
  companySize: InputMaybe<Scalars['String']['input']>;
  contactEmail: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  employmentType: Scalars['String']['input'];
  experienceLevel: InputMaybe<Scalars['String']['input']>;
  featured: InputMaybe<Scalars['Boolean']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  remote: InputMaybe<Scalars['Boolean']['input']>;
  requirements: InputMaybe<Array<Scalars['String']['input']>>;
  salaryRange: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  applyForJob: Maybe<Scalars['Boolean']['output']>;
  createJob: Maybe<Job>;
  saveJob: Maybe<Scalars['Boolean']['output']>;
};


export type MutationApplyForJobArgs = {
  jobId: Scalars['ID']['input'];
  resumeUrl: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateJobArgs = {
  input: JobInput;
};


export type MutationSaveJobArgs = {
  jobId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  job: Job;
  jobs: Array<Job>;
  jobsByCompany: Array<Job>;
  jobsByTag: Array<Job>;
  searchJobs: Array<Job>;
};


export type QueryJobArgs = {
  id: Scalars['ID']['input'];
};


export type QueryJobsByCompanyArgs = {
  company: Scalars['String']['input'];
};


export type QueryJobsByTagArgs = {
  tag: Scalars['String']['input'];
};


export type QuerySearchJobsArgs = {
  keyword: Scalars['String']['input'];
};

export type GetJobQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetJobQuery = { __typename?: 'Query', job: { __typename?: 'Job', id: string, title: string, description: string, company: string, tags: Array<string>, location: string, time: string, url: string, applicationDeadline: string | null, applicationProcess: string | null, benefits: Array<string> | null, companyDescription: string | null, companySize: string | null, contactEmail: string | null, employmentType: string, experienceLevel: string | null, featured: boolean, remote: boolean | null, salaryRange: string | null, requirements: Array<string> | null } };

export type GetAllJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllJobsQuery = { __typename?: 'Query', jobs: Array<{ __typename?: 'Job', id: string, title: string, company: string, tags: Array<string>, location: string, time: string, employmentType: string }> };

export type CreateJobMutationVariables = Exact<{
  input: JobInput;
}>;


export type CreateJobMutation = { __typename?: 'Mutation', createJob: { __typename?: 'Job', id: string } | null };
