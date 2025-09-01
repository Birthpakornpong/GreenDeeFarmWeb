import { ClockIcon } from "@heroicons/react/solid";
import ApiNews from "api/ApiNews";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { ConvertDateShortThai } from "utils";
import styles from './news.module.css'
import TitleMenu from "@components/TitlePage";


const NewsPage = ({ result = [] }) => {
    return <div>
        <Head>
            <title>ข่าวสาร</title>
            <meta name="description" content="ข่าวสาร - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu imageSrc="/assets/images/contact.webp" title="ข่าวสาร" description='ข่าวสาร' />
    
        <div className="container mx-auto px-4 mt-7 sm:mt-10">
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {result.map((item, index) => {
                    return <Link key={item.id} href={`/news/${item.id}`}>
                        <div key={item.name} className="relative rounded-lg flex-col border-2 bg-white cursor-pointer">
                            <img className={`w-full rounded-t-md h-[150px] sm:h-[200px] object-cover`}
                                src={process.env.IMAGE_BACKEND_URL + item.image} />
                            <div className="flex flex-col p-2 px-3 gap-y-1 h-28">
                                <label className="font-bold text-black line-clamp-1">{item.title}</label>
                                <small className={`text-gray-link line-clamp-2 ${styles.small_description}`}>
                                    {item.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}</small>
                                <div className="flex gap-x-1 flex-1 items-end">
                                    <ClockIcon color="#666" className="block h-5 w-4" aria-hidden="true" />
                                    <small>{ConvertDateShortThai(item.updatedate, 'DD MMM YYYY')}</small>
                                </div>
                            </div>
                        </div>
                    </Link>
                })}

            </div>
        </div>
    </div>
}
// NewsPage.getServerSideProps = async ctx => {
//     const result = await ApiNews.get();
//     return { result: result }
// }
export async function getServerSideProps({ params }) {
    const result = await ApiNews.get();
    return {
        props: {
            result: result.data
        }
    }
}



export default NewsPage;