import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const data = [
    {
        id: 1,
        name: "นายยืนยง คงกระพัน",
        tel: "0812345678",
        address: `9/317 หมู่ที่ 6 ซอยบางใหญ่ซิตี้  ตำบลเสาธงหิน อำเภอบางใหญ่ จังหวัดนนทบุรี 11140`,
        is_default: true
    },
    {
        id: 2,
        name: "นายยืนยง คงกระพัน",
        tel: "0812345678",
        address: `69/117 หมู่ที่ 10 ซอยกันตนา ตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี 11240`,
        is_default: false
    }
]

const EditAddress = () => {
    const router = useRouter();
    const [activeAddress, setactiveAddress] = useState(data.find(x => x.is_default)?.id ?? 0);
    return <div>
        <Head>
            <title>Box Size</title>
            <meta name="description" content="Box Size Page - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu title={"เปลี่ยนที่อยู่"}
                imageClass={'h-24 sm:h-28'}
                imageSrc="/assets/images/addressTitle.webp"
            />
        <div className='container mx-auto px-4 mt-7 sm:mt-10'>
            <div className="flex flex-col gap-y-4">
                {data.map((item, index) => {
                    const isActiveClass = item.id == activeAddress ? "border-4 border-blue-secondary" : "border";
                    return <div key={item.id} onClick={() => setactiveAddress(item.id)}
                        className={`${isActiveClass} rounded-lg p-3 lg:p-5 cursor-pointer`}>
                        <div className='flex py-3 gap-3 lg:gap-5'>
                            <img className="h-10" src="/assets/images/location.webp" />
                            <div className='flex flex-col lg:gap-5'>
                                <div className='flex gap-3 lg:gap-5'>
                                    <label className="text-sm font-semibold">{item.name}</label>
                                    <label className="text-gray-text text-sm font-semibold">Tel : {item.tel}</label>
                                </div>
                                <label className="text-sm">{item.address}</label>
                                {item.is_default && <button className='border border-red-default rounded-md w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>}
                            </div>
                        </div>
                    </div>
                })}
                <div className="flex gap-x-4 justify-between">
                    <button className='flex col-span-6 lg:col-span-1 bg-blue-primary rounded-lg text-white text-sm p-2 justify-center items-center'>
                        <img className="h-4 mx-2" src="/assets/icons/plus-circle.svg" />
                        เพิ่มที่อยู่ใหม่
                    </button>
                    <button onClick={() => {
                        router.push('/appoint/summary');
                    }} className='bg-blue-secondary text-white text-sm py-3 px-3  w-32 rounded-lg'>ยืนยันที่อยู่</button>
                </div>
            </div>

        </div>

    </div>
}

export default EditAddress;