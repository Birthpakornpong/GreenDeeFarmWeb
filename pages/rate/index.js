import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { Map } from '@heroicons/react/solid'
import ApiMasters from "api/ApiMasters";
import { useEffect, useState } from "react";
import { Disclosure, RadioGroup, Switch } from '@headlessui/react'
import _ from 'lodash';


const BoxSize = ({ priceTemplateMaster = [] }) => {
    const [priceTemplate, setpriceTemplate] = useState([]);
    const [zoneOrigin, setzoneOrigin] = useState([]);
    useEffect(() => {
        const priceTemplateList = priceTemplateMaster.filter(x => x.template_name == 'Standard Template');
        const zoneOrigin = _(priceTemplateList.filter(x => x.zone_origin > 0))
            .groupBy(o => o.zone_origin_name)
            .map((items, key) => ({ value: key, label: key, zone_origin: items[0].zone_origin }))
            .value();
        setpriceTemplate(priceTemplateList)
        setzoneOrigin(zoneOrigin);
    }, []);


    useEffect(() => {
        console.log('priceTemplate::', priceTemplate)
    }, [priceTemplate]);
    return <div>
        <Head>
            <title>Box Size</title>
            <meta name="description" content="Box Size Page - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu title={"อัตราค่าบริการ"}
                imageClass={'h-24 sm:h-28'}
                imageSrc="/assets/images/rateTitle.webp"
                description="อัตราค่าบริการจะคำนวณจากระยะทางต้นทาง ระยะทางปลายทางและประเภทของการขนส่ง"
            />
        <div className="container mx-auto px-4 mt-7 sm:mt-10">
            <div className="flex flex-col ">
                <h1 className="text-xl sm:text-3xl text-blue-primary">
                    อัตราค่าบริการขนส่งสินค้าควบคุมอุณหภูมิ (Cool Box)
                </h1>
                <div className="flex flex-col mt-3 pl-4 gap-3">
                    {zoneOrigin.map((item) => {
                        const price = priceTemplate.filter(x => x.zone_origin == item.zone_origin);

                        return (
                            <Disclosure key={item.value}>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="">
                                            <div className='flex justify-between items-center p-2'>
                                                <div className='flex gap-3 items-center'>
                                                    <label className="text-xl sm:text-xl text-blue-primary">
                                                        ต้นทาง{item.label} (Cool Box)
                                                    </label>
                                                </div>
                                            </div>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="">
                                            <div className='overflow-auto'>
                                                <table className="table-auto overflow-scroll w-full tableB">
                                                    <thead>
                                                        <tr>
                                                            <th rowSpan={2} width="30%">ขนาดกล่อง</th>
                                                            <th colSpan={price.length}>ปลายทาง</th>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <th key={priceItem?.id} className="whitespace-nowrap">{priceItem.zone_destination_name}</th>
                                                                })
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Size S ขนาดไม่เกิน 25x29x20 ซม. (แช่เย็น)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_chilled_s}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>Size M ขนาดไม่เกิน 25x38x27 ซม. (แช่เย็น)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_chilled_m}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>Size L ขนาดไม่เกิน 30x45x38 ซม. (แช่เย็น)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_chilled_l}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>Size S ขนาดไม่เกิน 25x29x20 ซม. (แช่แข็ง)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_frozen_s}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>Size M ขนาดไม่เกิน 25x38x27 ซม. (แช่แข็ง)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_frozen_m}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>Size L ขนาดไม่เกิน 30x45x38 ซม. (แช่แข็ง)</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.cool_frozen_l}</td>
                                                                })
                                                            }
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Disclosure.Panel>
                                    </>
                                )}

                            </Disclosure>
                        )
                    })
                    }
                </div>
            </div>
            <div className="flex flex-col mt-10">
                <h1 className="text-xl sm:text-3xl text-blue-primary">
                    อัตราค่าบริการขนส่งสินค้าควบคุมอุณหภูมิ (Foam Box)
                </h1>
                <div className="flex flex-col mt-3 pl-4 gap-3">
                    {zoneOrigin.map((item) => {
                        const price = priceTemplate.filter(x => x.zone_origin == item.zone_origin);

                        return (
                            <Disclosure key={item.value}>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="">
                                            <div className='flex justify-between items-center p-2'>
                                                <div className='flex gap-3 items-center'>
                                                    <label className="text-xl sm:text-xl text-blue-primary">
                                                        ต้นทาง{item.label} (Foam Box)
                                                    </label>
                                                </div>
                                            </div>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="">
                                            <div className='overflow-auto'>
                                                <table className="table-auto overflow-scroll w-full tableB">
                                                    <thead>
                                                        <tr>
                                                            <th rowSpan={2} width="25%">ขนาดกล่องและปริมาตร
                                                                (กว้าง*ยาว*สูง)
                                                                {/* กว้างไม่เกิน 43.5 ซม.
                                                                ยาวไม่เกิน 54.5 ซม.
                                                                สูงไม่เกิน 27.5 ซม. */}
                                                            </th>
                                                            <th rowSpan={2} width="10%">น้ำหนักไม่เกิน</th>
                                                            <th colSpan={price.length}>ปลายทาง</th>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <th key={priceItem?.id} className="whitespace-nowrap">{priceItem.zone_destination_name}</th>
                                                                })
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{`S1 < 7,500 ลบ.ซม.`}</td>
                                                            <td>5 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_s1}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>{`S2 < 15,500 ลบ.ซม.`}</td>
                                                            <td>10 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_s2}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>{`A1 < 25,000 ลบ.ซม.`}</td>
                                                            <td>15 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_a1}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>{`A2 < 50,000 ลบ.ซม.`}</td>
                                                            <td>20 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_a2}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>{`B1 < 75,000 ลบ.ซม.`}</td>
                                                            <td>25 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_b1}</td>
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td>{`B2 < 100,000 ลบ.ซม.`}</td>
                                                            <td>30 กก.</td>
                                                            {
                                                                _.orderBy(price, 'zone_destination_name').map((priceItem, priceIndex) => {
                                                                    return <td key={priceItem?.id} className="whitespace-nowrap">{priceItem.foam_b2}</td>
                                                                })
                                                            }
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Disclosure.Panel>
                                    </>
                                )}

                            </Disclosure>
                        )
                    })
                    }
                </div>
            </div>
            {/* {data.map((item, index) => {
                return <div key={item.size} className={`relative ${index > 0 ? "mt-10" : "mt-0"}`}>
                    <div className="flex items-center">
                        <div className={`${renderBG(item.size)} px-2 sm:px-5 py-1 rounded-lg`}>
                            <label className="text-white text-sm sm:text-xl">Size {item.size}</label>
                        </div>
                        <label className="ml-2 italic font-bold text-sm sm:text-base">{item.notmore}</label>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-blue-secondary_light flex-1 px-0 sm:px-5 mt-3 h-20 items-center flex leading-6">
                            <div className="flex flex-col">
                                {item.priceList.map((price) => {
                                    return <div key={price.province} className="flex">
                                        <LocationMarkerIcon
                                            className="w-5 h-5 ml-2 mr-2 text-blue-primary"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm sm:text-base">{price.province}</span>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 flex leading-6">
                            <div className="w-20 sm:w-32 bg-blue-neon h-20 sm:h-28 relative flex justify-center items-end">
                                <div className="flex-col absolute " style={{ top: '-40px' }}>
                                    <span className="text-blue-primary text-sm sm:text-base">แช่เย็น</span>
                                    <img className="h-10 sm:h-16" src="/assets/images/trackingTitle.webp" />
                                </div>
                                <div className="flex flex-col text-center mb-0 sm:mb-2">
                                    {item.priceList.map((price) => {
                                        return <label key={"label1-" + price.province} className="text-blue-primary font-bold text-sm sm:text-base">{price.price_chilled}</label>
                                    })}
                                </div>
                            </div>
                            <div className="w-20 sm:w-32 bg-blue-primary h-20 sm:h-28 relative flex justify-center items-end">
                                <div className="flex-col absolute " style={{ top: '-40px' }}>
                                    <span className="text-blue-primary text-sm sm:text-base">แช่แข็ง</span>
                                    <img className="h-10 sm:h-16" src="/assets/images/trackingTitle.webp" />
                                </div>
                                <div className="flex flex-col text-center mb-0 sm:mb-2">
                                    {item.priceList.map((price) => {
                                        return <label key={"label2-" + price.province} className="text-white font-bold text-sm sm:text-base">{price.price_frozen}</label>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })} */}
            {/* <div className="mt-10 rounded-lg bg-orange-thin px-7 py-5">
                <h5 className="text-blue-primary">เงื่อนไข</h5>
                <div className="flex flex-col mt-2">
                    <ul className="list-square">
                        {condition.map((item, index) => {
                            return <li key={item.value}>{`${item.value}`}</li>
                        })}
                    </ul>
                </div>

            </div>
            <button className="w-full px-16 mt-10 py-3 bg-blue-secondary rounded-md text-white mt-3">
                คำนวณขนาดกล่องพัสดุ
            </button> */}
        </div>
    </div >
}

export async function getServerSideProps({ params }) {
    const resultBox = await ApiMasters.getPrice();
    const { typeSize, serviceType, priceTemplate } = resultBox.data;
    return {
        props: {
            priceTemplateMaster: priceTemplate,
        }
    }
}


export default BoxSize;