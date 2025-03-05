"use server";

import axios from "axios";

export type LinkedInPostProps = {
    company: string;
    title: string;
    location: string;
    remote: boolean;
    featured: boolean;
    id: string;
    salaryRange: string | null;
    tags: string[];
};

export async function createLinkedInPost({
    company,
    title,
    location,
    remote,
    featured,
    salaryRange,
    id,
    tags,
}: LinkedInPostProps) {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;

    const customTags = tags.map((tag) => `#${tag.toLowerCase()}`);

    const postData = {
        author: "urn:li:organization:106628653",
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                    text: `NEW JOB POSTED 🗣️🗣️🗣️ 

                    ${company} is hiring for ${title} in ${location}${
                        remote ? " or remote" : ""
                    }${
                        salaryRange
                            ? ` with a salary range of ${salaryRange}`
                            : ""
                    }
                    ${featured ? "They are hiring urgently! 🔥🔥🔥" : ""}

                    Apply now: https://jaiboard.com/jobs/${id}

                    #hiring #ai #machinelearning #data #jobsearch #jobboard #jobs #jaiboard ${customTags.join(
                        " "
                    )}
                    `,
                },
                shareMediaCategory: "NONE",
            },
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
    };

    const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        postData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response;
}
