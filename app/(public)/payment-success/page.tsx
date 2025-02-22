"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 2000);
    }, [router]);

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center w-full mt-10'>
                    Payment successful! Redirecting...
                </div>
            </div>
        </div>
    );
}
