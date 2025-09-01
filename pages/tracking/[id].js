import Head from "next/head";
import styles from '@components/Step.module.css'
import ApiOrders from "api/ApiOrders";
import { useEffect, useState } from "react";
import moment from "moment";
import { ConvertDateShort } from "utils";
import _ from 'lodash';

const TrackingFind = ({ order }) => {
    const [itemsList, setitemsList] = useState([]);
    useEffect(() => {
        order.trackings.map((item, index) => {
            var myDate = moment(item.status_date, "DD/MM/YYYY HH:mm:ss");
            if (myDate.year() > 2500) {
                myDate = moment(myDate).add(-543, 'years');
            } else {
                myDate = moment(myDate);
            }
            item.myDate = myDate;
        })
        const history = _(order.trackings)
            .groupBy(o => o.tracking_ref)
            .map((items, key) => ({ value: key, label: items[0].tracking_ref, items: items }))
            .value();

        setitemsList(history);
    }, []);
    return (
        <>
            <Head>
                <title>Tracking</title>
                <meta name="description" content="Tracking page - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="tracking_detail" className="container px-4 sm:mx-auto  mt-7 sm:mt-10">
                <div className="flex items-center">
                    <img src="/assets/icons/barcode.svg" className="h-8 w-8" />
                    <label className="text-gray-text ml-2 font-bold">{order.order_code}</label>
                </div>

                <div className="flex items-end mt-5 sm:mt-7 justify-between flex-wrap">
                    <div className="flex flex-col">
                        <h5 className="text-blue-primary text-3xl">{order.recv_province}</h5>
                        {/* <h1 className="text-orange-default text-1xl">อยู่ระหว่างการนำจ่าย</h1> */}
                    </div>
                    {/* <div className="flex flex-col text-right">
                        <label className="text-gray-thin">{`ผู้รับ : ${order.recv_name}   Tel : ${order.recv_tel}`}</label>
                        <label className="text-gray-thin">{`${order.recv_address} ${order.recv_subdistrict} ${order.recv_district} ${order.recv_province} ${order.recv_zipcode}`}</label>
                    </div> */}
                </div>
                {
                    itemsList.map((item, index) => {
                        return <div key={`item-${index}`}>
                            <div className='flex justify-between py-5'>
                                <div className='flex items-center'>
                                    <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                    <div className='flex flex-col'>
                                        <label className="text-xs lg:text-base font-semibold">
                                            {item.items[0].type_name} {`(${item.items[0].service_name})`}
                                        </label>
                                        <label className="text-xs lg:text-base font-semibold">
                                            Size : {item.items[0].size_name}
                                            {/* &nbsp;&nbsp; {item.price_amt} บาท */}
                                        </label>
                                    </div>
                                </div>
                                <div className='self-end'>
                                    <label className="text-xs lg:text-base font-semibold">
                                        {item.items[0].tracking_ref}
                                    </label>
                                </div>
                            </div>
                            {
                                _.orderBy(item.items, 'myDate', ['desc']).map((item, index) => {
                                    var varDate = "2018-01-19 18:05:01.423";

                                    var myDate = moment(item.myDate, "DD/MM/YYYY HH:mm:ss").format("DD-MM-YYYY HH:mm:ss");
                                    // if (myDate.year() > 2500) {
                                    //     myDate = moment(myDate).add(-543, 'years').format("DD-MM-YYYY HH:mm:ss");
                                    // } else {
                                    //     myDate = moment(myDate).format("DD-MM-YYYY HH:mm:ss");
                                    // }
                                    return <div key={'tracking-' + item.id} className={`${styles.step} ${styles.active}`}>
                                        <div className={`${styles.v_stepper}`}>
                                            <div className={`${styles.circle}`}></div>
                                            <div className={`${styles.line}`}></div>
                                        </div>

                                        <div className={`${styles.content} flex-col flex`}>
                                            <h1 className="text-blue-primary">{myDate}</h1>
                                            <label className="text-orange-default">{item.status_description}</label>
                                            {/* <label className="text-sm text-gray-text">เบอร์โทรศัพท์ : 0812345678</label> */}
                                            <label className="text-sm text-gray-text">{item.json?.location}</label>
                                            {
                                                (item.status == 501 && item.json?.signature) &&
                                                <img src={item.json?.signature} className={`h-20 sm:h-24`} />
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    })
                }

                <div className="mt-5 mb-5 h-0.5 bg-gray-light w-full"></div>
                {/* <div className={`${styles.container} mt-5 w-full sm:w-3/4 mx-auto`}>
                    <div className="flex mt-5 mb-10 sm:mt-7 justify-between flex-wrap">
                        <div className="flex flex-col gap-y-2 items-center">
                            <div className="rounded-[100%] h-20 w-20 bg-blue-neon flex items-center justify-center">
                                <img className="h-8" color="white" src="/assets/icons/box-white.svg" />
                            </div>
                            <span>นำเข้าระบบ</span>
                        </div>
                        <div className="flex flex-col gap-y-2 items-center">
                            <div className="rounded-[100%] h-20 w-20 bg-[#25d2fe] flex items-center justify-center">
                                <img className="h-8" color="white" src="/assets/icons/shipping-fast-white.svg" />
                            </div>
                            <span>ระหว่างขนส่ง</span>
                        </div>
                        <div className="flex flex-col gap-y-2 items-center">
                            <div className="rounded-[100%] h-20 w-20 bg-[#3dbcfe] flex items-center justify-center">
                                <img className="h-8" color="white" src="/assets/icons/shipping-fast-white.svg" />
                            </div>
                            <span>นำจ่าย</span>
                        </div>
                        <div className="flex flex-col gap-y-2 items-center">
                            <div className="rounded-[100%] h-20 w-20 bg-[#fe3b1f] flex items-center justify-center">
                                <img className="h-10" color="white" src="/assets/icons/exclamation.svg" />
                            </div>
                            <span>ไม่สำเร็จ</span>

                        </div>
                    </div>
                    <div className={`${styles.step} ${styles.active}`}>
                        <div className={`${styles.v_stepper}`}>
                            <div className={`${styles.circle}`}></div>
                            <div className={`${styles.line}`}></div>
                        </div>

                        <div className={`${styles.content} flex-col flex`}>
                            <h1 className="text-blue-primary">15/12/64   12:35 น.</h1>
                            <label className="text-orange-default">อยู่ระหว่างการนำจ่าย โดย นายว่องไว ทันใจดี </label>
                            <label className="text-sm text-gray-text">เบอร์โทรศัพท์ : 0812345678</label>
                            <label className="text-sm text-gray-text">บางใหญ่</label>
                        </div>
                    </div>


                    <div className={`${styles.step}`}>
                        <div className={`${styles.v_stepper}`}>
                            <div className={`${styles.circle}`}></div>
                            <div className={`${styles.line}`}></div>
                        </div>

                        <div className={`${styles.content} flex-col flex`}>
                            <h1 className="text-blue-primary">15/12/64   12:35 น.</h1>
                            <label className="text-orange-default">อยู่ระหว่างการขนส่ง </label>
                            <label className="text-sm text-gray-text">ถึงศูนย์กระจายสินค้า อ.บางใหญ่</label>
                        </div>
                    </div>


                    <div className={`${styles.step}`}>
                        <div className={`${styles.v_stepper}`}>
                            <div className={`${styles.circle}`}></div>
                            <div className={`${styles.line}`}></div>
                        </div>

                        <div className={`${styles.content} flex-col flex`}>
                            <h1 className="text-blue-primary">15/12/64   12:35 น.</h1>
                            <label className="text-orange-default">อยู่ระหว่างการขนส่ง</label>
                            <label className="text-sm text-gray-text">ตลิ่งชน</label>
                        </div>
                    </div>





                </div> */}
            </div>
        </>
    )
}



export async function getServerSideProps(params) {
    const result = await ApiOrders.findTracking(params.query.id);
    return {
        props: {
            order: result.data,
        },
    }
}

export default TrackingFind;