import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from '../../styles/Home.module.css'
const AboutPage = () => {
    return <div>
        <Head>
            <title>เกี่ยวกับเรา</title>
            <meta name="description" content="เกี่ยวกับเรา - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu imageSrc="/assets/images/contact.webp" title="เกี่ยวกับเรา" description='ติดต่อเรา' />
        <img className="w-full sm:w-[90%] object-cover mt-2"
            src="/assets/images/about.png" />
        <div className="container mx-auto px-4 mt-7 max-w-5xl">
            <div className="flex flex-col text-center">
                <h1 className="text-xl sm:text-3xl text-blue-primary">
                    FUZE (ฟิ้วซ์)
                </h1>
                <h1 className="text-xl sm:text-3xl text-blue-primary">
                    บริการขนส่งสินค้าควบคุมอุณหภูมิแบรนด์ใหม่
                </h1>
            </div>
            <div className="flex flex-col text-center mt-10">
                <label className="text-xl text-blue-primary">
                    ผนึกความร่วมมือระหว่าง
                </label>
            </div>
            <div className="flex-center mt-10 flex-wrap gap-x-8" style={{ marginTop: '-0.25rem' }}>
                <div className={`flex-center border-2 rounded-lg p-5 ${styles.logo_min_w} mt-5`}>
                    <img className="h-6 object-cover"
                        src="/assets/logo/thaipost.png" />
                </div>
                <div className={`flex-center border-2 rounded-lg p-5 ${styles.logo_min_w} mt-5`}>
                    <img className="h-6 object-cover"
                        src="/assets/logo/jwd.webp" />
                </div>
                <div className={`flex-center border-2 rounded-lg p-5 ${styles.logo_min_w} mt-5`}>
                    <img className="h-6 object-cover"
                        src="/assets/logo/flash.webp" />
                </div>
            </div>
            <div className="flex flex-col text-center mt-10">
                <label className="text-blue-primary text-base">
                    ผสาน 3 จุดเด่น ผู้ให้บริการขนส่งสินค้าแถวหน้าของประเทศ ด้านความเชี่ยวชาญการจัดการสินค้าควบคุมอุณหภูมิ เครือข่ายจุดให้บริการทั่วไทย
                    และขับเคลื่อนด้วยเทคโนโลยีที่ทันสมัย ครอบคลุมพื้นที่ทั่วไทยและอาเซียน
                </label>
            </div>
            <div className="flex flex-col text-center mt-10">
                <label className="text-blue-primary text-base">
                    FUZE (ฟิ้วซ์) พร้อมให้บริการรับส่งสินค้าในพื้นที่กรุงเทพฯ ปริมณฑลและต่างจังหวัด 6 เส้นทาง
                </label>
            </div>

        </div>
        {/* <div className="mt-20">
            <div className="bg-bg1 h-80 sm:h-96 relative">
                <div className="container mx-auto max-w-4xl text-right flex relative">
                    <div className="bg-order-place hidden sm:block sm:h-96 bg-contain bg-no-repeat w-full">

                    </div>
                    <div className="z-10 flex flex-col text-left absolute top-8 right-0 w-full sm:w-2/3 px-5">
                        <div className="bg-blue-primary h-10 w-20"></div>
                        <img className="h-20 object-contain mt-2 self-start"
                            src="/assets/logo/appicon.png" />
                        <div className="mt-2">
                            <label className="text-white text-sm sm:text-base">สะดวกสบายกับการใช้งาน Fuze Post  ได้ง่ายๆ โดยผ่าน Mobile Application ซึ่งรองรับทั้ง iOS และ Android โดย iOS เข้าไปที่ App Store หรือ Android เข้าไปที่ Google play จากนั้นค้นหาคำว่า Fuze Postหรือ Click ที่ปุ่มด้านล่าง</label>
                            <div className="flex mt-5 flex-wrap gap-x-4">
                                <img className="h-8 sm:h-12 object-cover mt-2"
                                    src="/assets/logo/appstore.webp" />
                                <img className="h-8 sm:h-12 object-cover mt-2"
                                    src="/assets/logo/googleplay.webp" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div> */}
    </div>
}

export default AboutPage;