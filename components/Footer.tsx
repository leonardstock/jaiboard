import Link from "next/link";

const Footer = () => {
    return (
        <footer className='bg-gray-50 border-t border-gray-200 py-6'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex lg:flex-row flex-col justify-between items-center'>
                {/* <div className='flex justify-between items-center'> */}
                <p className='text-gray-500'>
                    © 2025 Shousai Ltd. All rights reserved.
                </p>
                <div className='flex flex-col md:flex-row gap-2 items-center'>
                    <Link
                        href='/terms'
                        className='text-gray-500 hover:text-gray-900'>
                        Terms
                    </Link>
                    <Link
                        href='/privacy'
                        className='text-gray-500 hover:text-gray-900'>
                        Privacy
                    </Link>
                </div>
            </div>
            {/* </div> */}
        </footer>
    );
};

export default Footer;
