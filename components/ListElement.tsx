"use client";

import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow, parseISO } from "date-fns";
import { redirect } from "next/navigation";

type ListElementProps = {
    id: string;
    title: string;
    location: string;
    company: string;
    image: string | null;
    tags?: string[];
    time: string;
    featured: boolean;
    salaryRange: string | null;
};

const StyledTag = ({ text }: { text: string }) => {
    return (
        <div
            className='bg-gray-200 text-black rounded-lg px-3 py-1 text-sm hover:bg-gray-300'
            onClick={(e) => {
                e.stopPropagation();
                console.log("test");
            }}>
            {text}
        </div>
    );
};

const relativeTimeFromDate = (dateString: string): string => {
    // Parse the ISO date string
    const date = parseISO(dateString);

    // Get the relative time from the current date
    const distance = formatDistanceToNow(date, { addSuffix: true });

    return distance;
};

const ListElement = ({
    id,
    title,
    location,
    company,
    image,
    tags,
    time,
    featured,
    salaryRange,
}: ListElementProps) => {
    return (
        <div
            className={`w-full flex gap-2 rounded-lg border-2 border-gray-200 p-4 transition-all duration-300 ease-in-out p-6 shadow-md hover:scale-105 cursor-pointer ${
                featured ? "border-gradient" : "hover:border-gray-400"
            }`}
            onClick={() => {
                redirect(`/jobs/${id}`);
            }}>
            <div className='flex gap-5 items-center w-full'>
                {image && (
                    <Image
                        alt='company logo'
                        src={image}
                        width={50}
                        height={50}
                        loading='lazy'
                    />
                )}
                <div className='flex flex-col flex-1 gap-1'>
                    <div className='flex flex-row justify-between md:items-center md:gap-0 gap-2'>
                        <div className='flex items-center gap-1 text-gray-500'>
                            <div>{company}</div>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <Clock className='h-4 w-4' />
                            {relativeTimeFromDate(time)}
                        </div>
                    </div>
                    <div className='text-black text-xl font-bold'>{title}</div>
                    {salaryRange && (
                        <div className='text-gray-500 my-2 text-sm'>
                            {salaryRange}
                        </div>
                    )}
                    <div className='flex items-center gap-1 text-gray-500 my-2 text-sm'>
                        <MapPin className='h-5 w-5' />
                        <div className=''>{location}</div>
                    </div>
                    <div className='flex gap-2'>
                        {tags?.map((tag) => (
                            <StyledTag key={tag} text={tag}></StyledTag>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListElement;
