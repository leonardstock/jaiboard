"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";

type ListElementProps = {
    id: string;
    title: string;
    location: string;
    company: string;
    image: string | null;
    tags?: string[];
    time: string;
    featured: boolean;
};

const StyledTag = ({ text }: { text: string }) => {
    return (
        <div className='bg-gray-200 text-black rounded-lg px-3 py-1 text-sm'>
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
}: ListElementProps) => {
    return (
        <Link
            className={`w-full flex gap-2 rounded-lg border-2 border-gray-200 p-4 transition-all duration-300 ease-in-out p-6 shadow-md hover:scale-105 ${
                featured ? "border-gradient" : "hover:border-gray-400"
            }`}
            href={`/jobs/${id}`}>
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
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex items-center gap-1 text-gray-500'>
                            <div className='text-sm'>{company}</div>
                            <div className='text-sm'>•</div>
                            <div className='text-sm'>
                                {relativeTimeFromDate(time)}
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            {tags?.map((tag) => (
                                <StyledTag key={tag} text={tag}></StyledTag>
                            ))}
                        </div>
                    </div>
                    <div className='text-black text-xl font-bold'>{title}</div>
                    <div className='flex items-center gap-1 text-gray-500'>
                        <MapPin className='h-5 w-5' />
                        <div className=''>{location}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListElement;
