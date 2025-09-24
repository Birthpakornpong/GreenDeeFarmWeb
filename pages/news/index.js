import { ClockIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import { ConvertDateShortThai } from "utils";
import styles from './news.module.css'
import TitleMenu from "@components/TitlePage";
import newsData from "../../json/newsData";


const NewsPage = () => {
    return <div>
        <Head>
            <title>ข่าวสาร - Green Dee Farm</title>
            {/* <meta name="description" content="ข่าวสาร Green Dee Farm - ฟาร์มผักสลัดออร์แกนิก" />
            <link rel="icon" href="/favicon.ico" /> */}
        </Head>
        <TitleMenu imageSrc="/assets/images/contact.webp" title="ข่าวสาร" description='ข่าวสาร Green Dee Farm' />
    
        <div className="container mx-auto px-4 mt-7 sm:mt-10">
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {newsData.map((item, index) => {
                    return <Link key={item.id} href={`/news/${item.id}`}>
                        <div className="relative rounded-lg flex-col border-2 border-green-100 bg-white shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                            <img className={`w-full rounded-t-md h-[150px] sm:h-[200px] object-cover`}
                                src={item.image} />
                            <div className="flex flex-col p-4 gap-y-2 min-h-[140px]">
                                <label className="font-bold text-green-800 line-clamp-2 hover:text-green-600 transition-colors duration-200 text-base">{item.title}</label>
                                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                                    {item.description
                                        .replace(/<[^>]*>/g, "")
                                        .replace(/&nbsp;/g, " ")
                                        .replace(/&amp;/g, "&")
                                        .replace(/&lt;/g, "<")
                                        .replace(/&gt;/g, ">")
                                        .trim()}
                                </p>
                                <div className="flex gap-x-1 flex-1 items-end">
                                    <ClockIcon color="rgb(34, 197, 94)" className="block h-5 w-4" aria-hidden="true" />
                                    <small className="text-green-600">{ConvertDateShortThai(item.updatedate, 'DD MMM YYYY')}</small>
                                </div>
                            </div>
                        </div>
                    </Link>
                })}

            </div>
        </div>
    </div>
}
// Static data from newsData.js - no API calls needed



export default NewsPage;