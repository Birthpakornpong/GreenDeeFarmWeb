import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import ApiArea from "api/ApiArea";
import ApiMasters from "api/ApiMasters";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
const AreaPage = () => {
    const [area, setArea] = useState({});
    const [areaZone, setAreaZone] = useState([]);
    const [zone, setZone] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoading(true);
                // const result = await ApiArea.get();
                // const resultZone = await ApiArea.getZone();
                
                // setArea(result.data || {});
                // setAreaZone(resultZone.data || []);
                
                // const province = _(resultZone.data || [])
                //     .groupBy(o => o.zone_name)
                //     .map((items, key) => ({ value: key, label: key, items: items, image: items[0].image, zone_name: items[0].zone_name, exclude_province: items[0].exclude_province }))
                //     .value();
                // setZone(province);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return <div>
        <Head>
            <title>สินค้าและบริการ</title>
            {/* <meta name="description" content="พื้นที่บริการจัดส่งสินค้า - Fuze Application" />
            <link rel="icon" href="/favicon.ico" /> */}
        </Head>
        {/* <div className="ml-5 lg:ml-24">
            <TitleMenu title={"ขนาดกล่อง"}
                imageClass={'h-24 sm:h-28'}
                imageSrc="/assets/images/boxSizeTitle.webp"
                description="คำนวณขนาดของกล่องพัสดุ โดยใช้ด้านกว้าง + ยาว + สูง และน้ำหนักเพื่อให้ได้ขนาดที่ถูกต้อง"
            />
        </div> */}
        <div className="container mx-auto px-4 mt-7 sm:mt-20">
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
                </div>
            ) : (
                <>
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {[
                    {
                        name: "กรีนโอ๊ค",
                        englishName: "Green Oak",
                        image: "/assets/images/farm/green-oak.jpg",
                        description: "ผักสลัดใบเขียวสดใส รสชาติกรอบหวานอ่อน เหมาะสำหรับสลัดและแซนด์วิช",
                        benefits: "อมวิตามิน A, C และโฟเลต"
                    },
                    {
                        name: "เรดโอ๊ค",
                        englishName: "Red Oak",
                        image: "/assets/images/farm/red-oak.jpg",
                        description: "ผักสลัดใบแดงสวยงาม รสชาติเล็กน้อยขม เพิ่มสีสันให้อาหาร",
                        benefits: "อุดมไปด้วยแอนโทไซยานิน และเหล็ก"
                    },
                    {
                        name: "กรีนคอส",
                        englishName: "Green Cos",
                        image: "/assets/images/farm/green-cos.jpg",
                        description: "ผักสลัดใบยาวกรอบ รสชาติหวานชื่น เป็นที่นิยมในสลัดซีซาร์",
                        benefits: "ให้วิตามิน K และใยอาหารสูง"
                    }
                ].map((item, index) => {
                    return <div key={item.name} className="relative rounded-lg flex-col border-2 border-green-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="relative w-full h-48 sm:h-56">
                            <img 
                                className="w-full h-full object-cover" 
                                src={item.image} 
                                alt={item.name}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x300/4ade80/ffffff?text=" + encodeURIComponent(item.name);
                                }}
                            />
                            <div className={`bg-green-600 px-3 sm:px-5 py-2 rounded-lg absolute shadow-md z-10`} style={{ top: '15px', left: '15px' }}>
                                <label className="text-white font-bold text-base sm:text-lg">{item.name}</label>
                            </div>
                        </div>
                        <div className="px-4 py-4 text-center">
                            <label className="text-gray-500 text-lg sm:text-xs italic mb-2 block">{item.englishName}</label>
                            <p className="text-base sm:text-sm text-gray-700 mb-3 leading-relaxed">{item.description}</p>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <label className="text-sm sm:text-xs text-green-700 font-medium">{item.benefits}</label>
                            </div>
                        </div>
                    </div>
                })}

            </div>
            <div className="flex flex-wrap">
               
                <div className="mt-10 rounded-lg bg-green-50 px-7 py-5 w-full sm:w-1/2 border border-green-200">
                    <div className="flex items-center mb-5">
                        <img className="w-10 h-10 mr-2" src="/assets/icons/shipping-fast-bluePrimary.svg" />
                        <h5 className="text-green-600 font-bold">พื้นที่จัดส่งสินค้า</h5>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h6 className="text-green-700 font-semibold mb-2">จังหวัดที่ให้บริการ:</h6>
                            <ul className="text-gray-700 space-y-1">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    จังหวัดภูเก็ต
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    จังหวัดพังงา
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    จังหวัดกระบี่
                                </li>
                            </ul>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h6 className="text-green-800 font-semibold mb-2">เงื่อนไขการจัดส่ง:</h6>
                            <p className="text-green-700 text-sm">
                                🎉 <strong>จังหวัดภูเก็ต ส่งฟรี!</strong><br/>
                                📦 จังหวัดพังงา และกระบี่ มีค่าจัดส่ง
                            </p>
                        </div>
                    </div>
                </div>
                

            </div>
                </>
            )}
        </div>
    </div>
}

export default AreaPage;