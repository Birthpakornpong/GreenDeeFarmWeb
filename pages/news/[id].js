import Head from "next/head";
import Link from "next/link";
import { ConvertDateShort, ConvertDateShortThai } from "utils";
import styles from './news.module.css'
import { ClockIcon } from '@heroicons/react/solid'
import newsData from '../../json/newsData';

const NewsDetail = ({ result, news = [] }) => {
    return (
        <>
            <Head>
                <title>{result ? result.title + ' - Green Dee Farm' : 'ข่าวสาร - Green Dee Farm'}</title>
                <meta name="description" content={result ? result.title + ' - Green Dee Farm ฟาร์มผักไฮโดรโปนิกส์ออร์แกนิก' : 'ข่าวสาร Green Dee Farm'} />
                <link rel="icon" type="image/jpeg" href="/assets/images/farm/logo.jpg" />
            </Head>
            <div className="p-2 py-5 sm:p-5 bg-white mt-5">
                <div className="container mx-auto px-4">
                    <div className="sm:flex gap-x-20">
                        <div className="sm:basis-[70%] flex flex-col gap-y-4">
                            <div className="flex gap-x-1">
                                <ClockIcon color="rgb(34, 197, 94)" className="block h-6 w-6" aria-hidden="true" />
                                <span>{ConvertDateShortThai(result.updatedate, 'DD MMM YYYY')}</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">{result.title}</h1>
                            <img className={`w-full rounded-lg h-[150px] sm:h-[440px] object-cover`}
                                src={result.image} />
                            <label className={`text-black-text font-medium sm:leading-10 ${styles.description}`} dangerouslySetInnerHTML={{ __html: result.description }}>

                            </label>
                        </div>
                        <div className="basis-[100%] sm:basis-[30%] flex flex-col gap-y-4 mt-8 sm:mt-0">
                            <h1 className="text-lg sm:text-xl font-bold text-green-600">{"บทความอื่นๆ ที่น่าสนใจ"}</h1>
                            {news.map((item, index) => {
                                return <Link key={item.id} href={`/news/${item.id}`}>
                                    <div key={item.id} className="flex bg-white gap-x-3 cursor-pointer hover:shadow-md transition-shadow duration-300 rounded-lg p-3">
                                        <img className={`rounded-md w-20 sm:w-24 h-14 sm:h-16 object-cover flex-shrink-0`}
                                            src={item.image} />
                                        <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                                            <label className="font-bold text-black line-clamp-2 text-sm sm:text-sm leading-tight">{item.title}</label>
                                            <small className={`text-gray-500 line-clamp-2 text-xs leading-relaxed ${styles.small_description}`}>
                                                {item.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                                            </small>
                                        </div>
                                    </div>
                                </Link>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    
    // หาข่าวที่ต้องการตาม ID
    const result = newsData.find(news => news.id === id);
    
    // หาข่าวอื่นๆ ที่ไม่ใช่ข่าวปัจจุบัน
    const otherNews = newsData.filter(news => news.id !== id).slice(0, 3);
    
    // ถ้าไม่เจอข่าวที่ต้องการ ให้ redirect ไปหน้า 404
    if (!result) {
        return {
            notFound: true,
        }
    }
    
    return {
        props: {
            result: result,
            news: otherNews
        },
    }
}

export default NewsDetail;