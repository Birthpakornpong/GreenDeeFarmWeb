import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
const BoxSize = () => {
    return <div>
        <Head>
            <title>Box Size</title>
            <meta name="description" content="Box Size Page - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu title={"ขนาดกล่อง"}
                imageClass={'h-24 sm:h-28'}
                imageSrc="/assets/images/boxSizeTitle.webp"
                description="คำนวณขนาดของกล่องพัสดุ โดยใช้ด้านกว้าง + ยาว + สูง และน้ำหนักเพื่อให้ได้ขนาดที่ถูกต้อง"
            />
        <div className="container mx-auto px-4 mt-7 sm:mt-10">
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className="flex items-center flex-col p-10 py-5 bg-blue-secondary_light rounded-lg">
                    <div className="flex-1 flex items-end">
                        <img className="h-16"
                            src="/assets/images/trackingTitle.webp" />
                    </div>
                    <div className="flex-1 flex justify-end items-center flex-col">
                        <div className="bg-blue-primary px-10 py-1 mt-4 rounded-lg">
                            <label className="text-white text-xl">Size S</label>
                        </div>
                        <h1 className="text-blue-primary text-2xl font-bold mt-1">120 บาท</h1>
                    </div>
                </div>
                <div className="flex items-center flex-col p-10 py-5 bg-blue-secondary_light rounded-lg">
                    <div className="flex-1 flex items-end">
                        <img className="h-20"
                            src="/assets/images/trackingTitle.webp" />
                    </div>
                    <div className="flex-1 flex justify-end items-center flex-col">
                        <div className="bg-blue-primary px-10 py-1 mt-4 rounded-lg">
                            <label className="text-white text-xl">Size M</label>
                        </div>
                        <h1 className="text-blue-primary text-2xl font-bold mt-1">120 บาท</h1>
                    </div>
                </div>
                <div className="flex items-center flex-col p-10 py-5 bg-blue-secondary_light rounded-lg">
                    <div className="flex-1 flex items-end">
                        <img className="h-28"
                            src="/assets/images/trackingTitle.webp" />
                    </div>
                    <div className="flex-1 flex justify-end items-center flex-col">
                        <div className="bg-blue-primary px-10 py-1 mt-4 rounded-lg">
                            <label className="text-white text-xl">Size L</label>
                        </div>
                        <h1 className="text-blue-primary text-2xl font-bold mt-1">170 บาท</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default BoxSize;