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
const AreaPage = ({ area = {}, area_zone = [] }) => {
    console.log('area_zone', area_zone);
    const [zone, setZone] = useState([]);
    useEffect(() => {
        const province = _(area_zone)
            .groupBy(o => o.zone_name)
            .map((items, key) => ({ value: key, label: key, items: items, image: items[0].image, zone_name: items[0].zone_name, exclude_province: items[0].exclude_province }))
            .value();
        setZone(province);
    }, []);
    return <div>
        <Head>
            <title>พื้นที่บริการจัดส่งสินค้า</title>
            <meta name="description" content="พื้นที่บริการจัดส่งสินค้า - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <div className="ml-5 lg:ml-24">
            <TitleMenu title={"ขนาดกล่อง"}
                imageClass={'h-24 sm:h-28'}
                imageSrc="/assets/images/boxSizeTitle.webp"
                description="คำนวณขนาดของกล่องพัสดุ โดยใช้ด้านกว้าง + ยาว + สูง และน้ำหนักเพื่อให้ได้ขนาดที่ถูกต้อง"
            />
        </div> */}
        <div className="container mx-auto px-4 mt-7 sm:mt-20">
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {zone.map((item, index) => {
                    return <div key={item.zone_name} className="flex-center pt-8 pb-2 pt-5 relative rounded-lg flex-col border-2">
                        <div className={`bg-blue-primary px-2 sm:px-5 py-1 rounded-lg absolute`} style={{ top: '-20px' }}>
                            <label className="text-white text-sm sm:text-xl">{item.zone_name}</label>
                        </div>
                        <img className={`${item.zone_name == "ภาคตะวันตก" ? "h-12" : "h-20"} ${item.zone_name == "ภาคตะวันตก" ? "sm:h-16" : "sm:h-24"}  mb-2 object-contain`} src={process.env.IMAGE_BACKEND_URL + item.image} />
                        <label className="font-bold text-blue-primary">จัดส่งทุกจังหวัด</label>
                        <label className="text-sm italic text-orange-default"></label>
                        {
                            (item.exclude_province) && <>
                                <label className="text-sm italic text-orange-default">ยกเว้นจังหวัด : {item.exclude_province}</label>
                            </>
                            // (item.except && item.except.length > 0) && item.except.map((subitem) => {
                            //     return <label className="text-sm italic text-orange-default">จังหวัดที่ยังไม่เปิดบริการ : แม่ฮ่องสอน</label>
                            // })
                        }
                        <Disclosure key={index}>
                            {({ open }) => (
                                /* Use the `open` state to conditionally change the direction of an icon. */
                                <>
                                    <div className={`flex flex-col w-full justify-between
                                ${open ? 'rounded-bl-none rounded-br-none ' : ''}`
                                    }>

                                        <Disclosure.Button className={"flex items-center justify-center"}>
                                            <label className="italic text-sm cursor-pointer">ดูรายชื่อจังหวัด</label>
                                            <ChevronRightIcon className={open ? 'rotate-90 transform h-4 w-4' : 'h-4 w-4'} />
                                        </Disclosure.Button>
                                    </div>
                                    <Disclosure.Panel className={'w-full px-3 italic py-2 text-sm'}>
                                        <label className="break-words"> {
                                            item.items.map(x => x.province).join(', ')
                                        }
                                        </label>
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>


                    </div>
                })}

            </div>
            <div className="flex flex-wrap">
                {
                    area.exclude_area && <div className="mt-10 rounded-lg bg-orange-thin px-7 py-5 flex-1 mr-0 sm:mr-5 text-black-text">
                        <div className="flex items-center mb-5">
                            <ExclamationCircleIcon
                                className="w-10 h-10 mr-2 text-orange-default text-orange-default"
                                aria-hidden="true"
                            />
                            <h5 className="text-orange-default">พื้นที่ยังไม่ให้บริการ</h5>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: area.exclude_area }}>

                        </div>
                    </div>
                }
                {
                    area.include_area && <div className="mt-10 rounded-lg bg-blue-secondary_light px-7 py-5 flex-1 ml-0 sm:ml-5">
                        <div className="flex items-center mb-5">
                            <img className="w-10 h-10 mr-2" src="/assets/icons/shipping-fast-bluePrimary.svg" />
                            <h5 className="text-blue-primary">พื้นที่เข้ารับสินค้า</h5>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: area.include_area }}>

                        </div>
                    </div>
                }

            </div>

        </div>
    </div>
}

export async function getServerSideProps({ params }) {
    const result = await ApiArea.get();
    const resultZone = await ApiArea.getZone();
    return {
        props: {
            area: result.data,
            area_zone: resultZone.data
        }
    }
}

export default AreaPage;