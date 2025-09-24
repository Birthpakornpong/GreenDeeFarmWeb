import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from '../../styles/Home.module.css'
const AboutPage = () => {
    return <div>
        <Head>
            <title>เกี่ยวกับเรา - Green Dee Farm</title>
            {/* <meta name="description" content="เกี่ยวกับเรา - Green Dee Farm ฟาร์มผักสลัดออร์แกนิกคุณภาสูง" />
            <link rel="icon" href="/favicon.ico" /> */}
        </Head>
        <TitleMenu imageSrc="/assets/images/farm/banner1.jpg" title="เกี่ยวกับเรา" description='Green Dee Farm - ฟาร์มผักสลัดออร์แกนิกคุณภาพสูง' />
        {/* <img className="w-full sm:w-[90%] object-cover mt-2 rounded-lg mx-auto"
            src="/assets/images/farm/logo-01.jpg" /> */}
        <div className="container mx-auto px-4 mt-7 max-w-5xl">
            <div className="flex flex-col text-center">
                <h1 className="text-2xl sm:text-4xl text-green-600 font-bold">
                    Green Dee Farm
                </h1>
                <h2 className="text-lg sm:text-2xl text-green-500 mt-2">
                    ฟาร์มผักสลัดออร์แกนิกคุณภาพสูง
                </h2>
                <p className="text-gray-600 mt-4 text-base sm:text-lg">
                    &ldquo;ปลูกด้วยใจ ส่งมอบความสดใหม่&rdquo;
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-700 mb-4">วิสัยทัศน์ของเรา</h3>
                    <p className="text-gray-700 leading-relaxed">
                        เป็นฟาร์มผักสลัดออร์แกนิกชั้นนำที่มุ่งมั่นในการผลิตผักสลัดคุณภาพสูง 
                        ปลอดสารเคมี เพื่อสุขภาพที่ดีของผู้บริโภค และรักษาสิ่งแวดล้อมอย่างยั่งยืน
                    </p>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-700 mb-4">พันธกิจของเรา</h3>
                    <p className="text-gray-700 leading-relaxed">
                        ผลิตและจัดจำหน่ายผักสลัดออร์แกนิกคุณภาพสูง ด้วยเทคนิคไฮโดรโปนิกส์ที่ทันสมัย 
                        เพื่อมอบความสดใหม่และความปลอดภัยให้กับลูกค้าทุกคน
                    </p>
                </div>
            </div>
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-green-600 text-center mb-8">จุดเด่นของเรา</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                        <div className="text-green-600 text-3xl mb-3">🌱</div>
                        <h4 className="font-bold text-gray-800 mb-2">100% ออร์แกนิก</h4>
                        <p className="text-gray-600 text-sm">ปลูกโดยไม่ใช้สารเคมี ปุ่ยเคมี หรือยาฆ่าแมลง เพื่อความปลอดภัยสูงสุด</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                        <div className="text-blue-600 text-3xl mb-3">💧</div>
                        <h4 className="font-bold text-gray-800 mb-2">เทคนิคไฮโดรโปนิกส์</h4>
                        <p className="text-gray-600 text-sm">ใช้เทคโนโลยีการปลูกแบบไฮโดรโปนิกส์ที่ทันสมัย ควบคุมคุณภาพได้อย่างสมบูรณ์</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500">
                        <div className="text-amber-600 text-3xl mb-3">🚚</div>
                        <h4 className="font-bold text-gray-800 mb-2">ส่งสดใหม่ทุกวัน</h4>
                        <p className="text-gray-600 text-sm">จัดส่งผักสลัดสดใหม่ภายใน 24 ชั่วโมงหลังเก็บเกี่ยว ครอบคลุมภูเก็ต พังงา กระบี่</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-green-500 to-green-400 text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">ผลิตภัณฑ์ของเรา</h3>
                <div className="grid sm:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white/10 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">🥬 กรีนโอ๊ค</h4>
                        <p className="text-sm">ใบเขียวสดใส รสกรอบหวาน</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">🥗 เรดโอ๊ค</h4>
                        <p className="text-sm">ใบแดงสวยงาม รสเล็กน้อยขม</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">🥙 กรีนคอส</h4>
                        <p className="text-sm">ใบยาวกรอบ รสหวานชื่น</p>
                    </div>
                </div>
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