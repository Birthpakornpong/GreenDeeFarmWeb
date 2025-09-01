import ApiNews from "api/ApiNews";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { ConvertDateShort, ConvertDateShortThai } from "utils";
import styles from './news.module.css'
import { ClockIcon } from '@heroicons/react/solid'

const NewsDetail = ({ result, news = [] }) => {
    console.log("params::", result)
    const [data, setdata] = useState({
        title: `พ่อค้าแคชเชียร์คองเกรส มัฟฟินก่อนหน้าวัคค์เอ๊าะตุ๋ย แฟรนไชส์ วีนทัวร์ฟลุทว่ะ แพท
        เทิร์นคาร์โก้ซิม`,
        description: `ทาวน์เฮาส์แอร์ซาบะ สไตรค์ราสเบอร์รีคอนเฟิร์มโปรเจกต์ สต็อคคอนแทคคาปูชิโนทริปแทกติค ออร์เดอร์ดีกรีราเม็งทับซ้อน นายแบบ โอเวอร์คีตปฏิภาณเกรดดั๊มพ์ อีสต์ อึ๋มโคโยตี รันเวย์เทปหมวยคอนโดมิเนียม อาร์พีจีแพ็ค เอ๋อไลท์เวิร์กเจลแพตเทิร์น ซีนคาร์โก้ก๋ากั่น ฮากกาหมายปองเธคปฏิสัมพันธ์ ภควัมบดีเดี้ยงมอบตัวสแควร์ รีพอร์ทสวีท โปรเจ็กต์ปาสเตอร์เอ๋อวีเจ

        ซิมหมิงเอ็กซ์โปแชมเปี้ยน ปอดแหกไง ไวกิ้งอันเดอร์จิตพิสัยแจ็กเก็ต ทัวร์เพลย์บอยอุตสาหการชิฟฟอนยิม ภคันทลาพาธ เฟิร์ม ฟินิกซ์ เอเซีย พิซซ่า จีดีพี สเปคล็อตคูลเลอร์เอเซีย เดชานุภาพ คันธาระเวิร์ลด์ พันธกิจพรีเมียร์วาริชศาสตร์ชัตเตอร์น็อค ยอมรับ วิดีโอยูโรแคมป์รีวิว
        
        รีดไถ เวิร์กธัมโมไฟต์ สตริงรากหญ้า ธรรมาฟลุกจุ๊ยอพาร์ทเมนต์ ร็อคกิมจิซีอีโอ เอาท์ดอร์ อันตรกิริยา ซัพพลายคอรัปชั่นบาร์บีคิวท็อปบู๊ท ติ่มซำแพทเทิร์นสถาปัตย์สเกตช์ ควิกเบบี้รามาธิบดีโหลยโท่ย โมจิ ออร์เดอร์เทียมทานแกงค์แดนซ์ แครกเกอร์มหาอุปราชาวีไอพีดีพาร์ทเมนต์ ฮอต ต่อรองอุรังคธาตุรากหญ้า เยนชาร์ตอีสต์
        
        เอ๊าะอะเมจิกรีสอร์ต สตริง สเตริโอฮอตดอกแอปเปิล เป็นไงบอกซ์เฟิร์ม จิ๊กซอว์เฉิ่มวานิลา แฟร์รามเทพโบกี้โคโยตี้เอ็นเตอร์เทน พาสปอร์ตหลินจือ ยอมรับ บึมไฮเวย์ แคร็กเกอร์แบต เคส ไฟลท์ไนน์ตุ๊ก เบิร์นเธค โอยัวะ ธรรมาสตรอเบอร์รีแม็กกาซีนรากหญ้ามวลชน อมาตยาธิปไตยศึกษาศาสตร์แรลลี
        
        โดมิโน ซิลเวอร์ยนตรกรรมซาดิสม์เธค พรีเมียร์แพตเทิร์นรามเทพ เชอร์รี่แอลมอนด์ ลีเมอร์ติวเตอร์ไฟลต์ทีวีพิซซ่า โอ้ยเห็นด้วยคอนโดมิเนียม คาแรคเตอร์ ปัจฉิมนิเทศอมาตยาธิปไตย ช็อปเปอร์คาร์โอเค ชนะเลิศ ซัพพลายเออร์ซิตี้ออสซี่ แอปเปิลชะโนดบรรพชนเดโมตี๋ เพลซ ชิฟฟอนสต๊อค ธรรมาภิบาลเดอะ แฟนตาซีทาวน์เทคโนไตรมาส`
    });
    return (
        <>
            <Head>
                <title>ข่าวสาร</title>
                <meta name="description" content="ข่าวสาร - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="p-2 py-5 sm:p-5 bg-white mt-5">
                <div className="container mx-auto px-4">
                    <div className="sm:flex gap-x-20">
                        <div className="sm:basis-[70%] flex flex-col gap-y-4">
                            <div className="flex gap-x-1">
                                <ClockIcon color="#002169" className="block h-6 w-6" aria-hidden="true" />
                                <span>{ConvertDateShortThai(result.updatedate, 'DD MMM YYYY')}</span>
                            </div>
                            <h1 className="text-xl">{result.title}</h1>
                            <img className={`w-full rounded-lg h-[150px] sm:h-[440px] object-cover`}
                                src={process.env.IMAGE_BACKEND_URL + result.image} />
                            <label className={`text-black-text font-medium sm:leading-10 ${styles.description}`} dangerouslySetInnerHTML={{ __html: result.description }}>

                            </label>
                        </div>
                        <div className="basis-[100%] sm:basis-[30%] flex flex-col gap-y-4">
                            <h1 className="text-xl">{"บทความอื่นๆ ที่น่าสนใจ"}</h1>
                            {news.map((item, index) => {
                                return <Link key={item.id} href={`/news/${item.id}`}>
                                    <div key={item.name} className="flex bg-white gap-x-2 cursor-pointer">
                                        <img className={`rounded-t-md w-24 object-cover`}
                                            src={process.env.IMAGE_BACKEND_URL + item.image} />
                                        <div className="flex flex-col p-2 px-3 gap-y-1 h-20">
                                            <label className="font-bold text-black line-clamp-1">{item.title}</label>
                                            <small className={`text-gray-link line-clamp-2 ${styles.small_description}`}>
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

// NewsDetail.getInitialProps = async params => {
//     const id = params.query.id;
//     return { id: id }
// }

export async function getServerSideProps(params) {
    const result = await ApiNews.getDetail(params.query.id);
    const news = await ApiNews.get();
    return {
        props: {
            result: result.data,
            news: news.data
        },
    }
}

export default NewsDetail;