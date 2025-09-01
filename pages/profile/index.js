import CustomModal from '@components/CustomModal/CustomModal';
import { SearchIcon } from '@heroicons/react/solid';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import ApiMasters from 'api/ApiMasters';
import ApiOrders from 'api/ApiOrders';
import ApiUsers from 'api/ApiUsers';
import _ from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { ConvertDateShortThai, CurrencyThai } from 'utils';

const Profile = ({ configContent = [] }) => {
    const userState = useSelector(state => state.user);
    const [modalCancel, setmodalCancel] = useState(false);
    const [status, setStatus] = useState('all')
    const [orders, setorders] = useState([]);
    const [ordersFilters, setordersFilters] = useState([]);
    const [cliamOrders, setcliamOrders] = useState([]);
    const [itemOrder, setitemOrder] = useState({});
    const [configPeriodDate, setconfigPeriodDate] = useState(0);
    const [state, setstate] = useState({
        fromdate: moment(),
        todate: moment(),
        order_code: "",
    });


    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10; // จำนวนแถวต่อหน้า

    // กำหนดคอลัมน์
    const columns = useMemo(
        () => [
            {
                header: "ลำดับ",
                cell: ({ row }) => row.index + 1 // เริ่มนับจาก 1
            },
            { accessorKey: "barcode", header: "เลข EL" },
            { accessorKey: "recv_name", header: "ลค ปลายทาง" },
            { accessorKey: "recv_province", header: "จังหวัดปลายทาง" },
            { accessorKey: "status_description", header: "สถานะ" },
        ],
        []
    );

    // ใช้งาน useReactTable

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: { pageIndex, pageSize },
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newPagination.pageIndex);
        },
    });

    const [dataTable, setdataTable] = useState([]);


    const [deliveryKPIData, setDeliveryKPIData] = useState({
        kpiYTD: [],
        kpiMTD: [],
        kpiToday: {
            parcels: [],
            customers: [],
            customersData: []
        }
    });

    useEffect(() => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const promise1 = getHistoryOrder();
        const promise2 = getClaimHistory();
        Promise.all([promise1, promise2]).then((result) => {
            toast.dismiss();
        })
        if (configContent.find(x => x.config_code == "claim_period_date")) {
            setconfigPeriodDate(parseInt(configContent.find(x => x.config_code == "claim_period_date").config_value))
        }
    }, []);

    useEffect(() => {
        if (status == "all") {
            setordersFilters(orders);
        } else if (status == "shipping") {
            setordersFilters(orders);
        } else {
            setordersFilters([]);
        }
    }, [status]);

    const getHistoryOrder = async () => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const result = await ApiOrders.historyOrders({
            ...state,
            fromdate: state.fromdate ? moment(state.fromdate).add(7, 'hours') : "",
            todate: state.todate ? moment(state.todate).add(7, 'hours') : "",
        });
        toast.dismiss();
        if (result.status == 200) {
            const history = _(result.data)
                .groupBy(o => o.order_code)
                .map((items, key) => ({ value: key, label: items[0].order_code, items: items, ...items[0] }))
                .value();
            setorders(history);
            setordersFilters(history);
        }
    }

    const getClaimHistory = async () => {
        const result = await ApiOrders.historyOrdersClaim();
        if (result.status == 200) {
            const { claim } = result.data
            const history = _(claim)
                .groupBy(o => o.id)
                .map((items, key) => ({ value: key, label: items[0].id, items: items, ...items[0] }))
                .value();
            setcliamOrders(history);
        }
    }

    const payment = async (item) => {
        try {
            const result = await ApiOrders.paymentOrders({
                order_code: item.order_code
            });
            const { data, status } = result;
            if (status == 200) {
                window.open(data.data.redirectUrl, "_self");
            }
        } catch (error) {
            toast.dismiss();
            const { data } = error.response;
            toast.error(data.error.message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
        }
    }

    const paymentOver = async (item) => {
        try {
            const result = await ApiOrders.paymentOrderOver({
                order_code: item.order_code
            });
            const { data, status } = result;
            if (status == 200) {
                window.open(data.data.redirectUrl, "_self");
            }
        } catch (error) {
            toast.dismiss();
            const { data } = error.response;
            toast.error(data.error.message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
        }
    }

    const getStatusOrder = (item) => {
        if (item.order_status == "WP") {
            return <div className='flex bg-orange-light rounded-full justify-center items-center px-2 py-1'>
                {/* <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" /> */}
                <label className='text-xss lg:text-sm text-white font-semibold'>ยังไม่ชำระเงิน</label>
            </div>
        } else if (item.order_status == "P") {
            return <div className='flex bg-orange-light rounded-full justify-center items-center px-2 py-1'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>อยู่ระหว่างการนำจ่าย</label>
            </div>
        }

    }

    const getStatusClaimOrder = (item) => {
        console.log('item::', item)
        if (item.claim_item_status == 1) {
            return <div className='flex bg-orange-light rounded-full justify-center items-center px-2 py-1 h-fit'>
                {/* <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" /> */}
                <label className='text-xss lg:text-sm text-white font-semibold'>แจ้งเคลม</label>
            </div>
        } else if (item.claim_item_status == 2) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1 h-fit'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>รับเรื่อง</label>
            </div>
        }
        else if (item.claim_item_status == 3) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1 h-fit'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>อยู่ระหว่างพิจารณา</label>
            </div>
        }
        else if (item.claim_item_status == 4) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1 h-fit'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>อยู่ระหว่างชดใช้ค่าเสียหาย</label>
            </div>
        }
        else if (item.claim_item_status == 5) {
            return <div className='flex bg-red-500 rounded-full justify-center items-center px-2 py-1 h-fit'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>{`ไม่เข้าเงื่อนไขการชดใช้ ${item.claim_item_note ? `(${item.claim_item_note})` : ""}`}</label>
            </div>
        }
        else if (item.claim_item_status == 6) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1 h-fit'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>{`เสร็จสิ้น ${item.claim_item_note ? `(${item.claim_item_note})` : ""}`}</label>
            </div>
        }

    }

    const getStatusComplainOrder = (item) => {
        if (item.complain_status == 1) {
            return <div className='flex bg-orange-light rounded-full justify-center items-center px-2 py-1'>
                {/* <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" /> */}
                <label className='text-xss lg:text-sm text-white font-semibold'>แจ้งร้องเรียน</label>
            </div>
        } else if (item.complain_status == 2) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>รับเรื่องร้องเรียน</label>
            </div>
        }
        else if (item.complain_status == 3) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>อยู่ระหว่างตรวจสอบข้อมูล</label>
            </div>
        }
        else if (item.complain_status == 4) {
            return <div className='flex bg-green-500 rounded-full justify-center items-center px-2 py-1'>
                <img className="h-4 mr-2" src="/assets/icons/shipping-fast-white.svg" />
                <label className='text-xss lg:text-sm text-white font-semibold'>{`เสร็จสิ้น ${item.admin_note ? `(${item.admin_note})` : ""}`}</label>
            </div>
        }
    }

    const getButtonOrder = (item) => {
        if (item.order_status == "WP") {
            return <div className='flex gap-x-2'>
                <button onClick={() => {
                    payment(item)
                }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                    <img className="h-4 mr-2" src="/assets/icons/basket.svg" />
                    ชำระเงิน
                </button>
                <button onClick={() => {
                    setitemOrder(item);
                    setmodalCancel(true)
                }} className='flex text-sm lg:text-lg text-red-500 items-center border border-red-500 py-1 px-3 rounded-full'>
                    ยกเลิก
                </button>
            </div>
        }
        else if (item.order_status == "P" || item.order_status == 'PU' || item.order_status == 'ID') {
            if ((parseFloat(item.order_price_amt) > parseFloat(item.payment_amt)) && (item.is_credit == false && !item.dropoff_code)) {
                return <div className='flex gap-x-2'>
                    <button onClick={() => {
                        paymentOver(item)
                    }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                        <img className="h-4 mr-2" src="/assets/icons/basket.svg" />
                        ชำระเงินเพิ่ม ({CurrencyThai(item.order_price_amt - item.payment_amt)})
                    </button>
                </div>
            }
            else {

                return <div className='flex gap-x-2'>

                    {
                        configPeriodDate > 0 ? <>
                            {
                                moment(item.book_date).add(configPeriodDate, 'days') >= moment() ?
                                    <Link href={`/profile/claim/${item.order_code}`}>
                                        <button onClick={() => {
                                        }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                            เคลมสินค้า
                                        </button>
                                    </Link> :
                                    <button onClick={() => {
                                        toast.error(`ไม่สามารถทำรายการเคลมได้ เนื่องจากเกินระยะเวลาที่กำหนดในเงื่อนไข`, {
                                            style: {
                                                borderRadius: '10px',
                                                background: '#333',
                                                color: '#fff',
                                            },
                                            className: "text-lg"
                                        })
                                    }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                        เคลมสินค้า
                                    </button>
                            }

                        </>
                            :
                            <Link href={`/profile/claim/${item.order_code}`}>
                                <button onClick={() => {
                                }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                    เคลมสินค้า
                                </button>
                            </Link>
                    }


                    <Link href={`/profile/complain_order/${item.order_code}`}>
                        <button onClick={() => {
                        }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                            ร้องเรียน
                        </button>
                    </Link>
                </div>
            }
        }
    }

    const cancelOrder = async () => {
        try {

            const result = await ApiOrders.cancelOrder({
                order_code: itemOrder.order_code
            });
            const { data, status } = result;
            if (status == 200) {
                setmodalCancel(false);
                toast.success('ลบรายการสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                });
                getHistoryOrder();
            }
        } catch (error) {
            toast.dismiss();
            const { data } = error.response;
            toast.error(data.error.message, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
        }
    }


    const onExportOrderSummary = async () => {
        try {
            const result = await ApiOrders.exportOrderSummary({
                ...state,
                fromdate: state.fromdate ? moment(state.fromdate).add(7, 'hours') : "",
                todate: state.todate ? moment(state.todate).add(7, 'hours') : "",
            });
            if (result.status === 200) {
                window.open(result.data);
                console.log(result)
            }
        } catch (error) {
            console.log(error)
            // CSwl.SwalClose();
            // CSwl.SwalErr(error);
        }
    };

    const onSearch = async () => {
        getHistoryOrder();
    };

    let statusText = [
        {
            label: "Sorting center",
            status: ["ออกจากคลังสินค้าเรียบร้อยแล้ว"],
        },
        {
            label: "อยู่ระหว่างขนส่ง",
            status: ["รับเข้า ณ ศูนย์คัดแยก", null, "รับเข้า Sorting Center หลักสี่เรียบร้อย", "แช่เก็บไว้ที่คลัง Fuze post", "รับฝาก"],
        },
        {
            label: "ถึงปณ.ปลายทาง",
            status: ["ออกจากที่ทำการ/ศูนย์ไปรษณีย์"],
        },
        // {
        //   label: "รับเข้า ศป.ปลายทาง",
        //   status: ["ถึงที่ทำการไปรษณีย์", "รับเข้า ณ ศูนย์คัดแยก"],
        // },
        {
            label: "อยู่ระหว่างนำจ่าย",
            status: ["ถึงที่ทำการไปรษณีย์", "อยู่ระหว่างการนำจ่าย", "อยู่ระหว่างการจัดส่ง/Delivery", "เจ้าหน้าที่ติดต่อผู้รับ"],
        },
        {
            label: "จัดส่งสำเร็จ",
            status: ["นำจ่ายสำเร็จ", "จัดส่งสำเร็จ/Delivery Successful"],
        },
        {
            label: "จัดส่งไม่สำเร็จ",
            status: ["นำจ่ายไม่สำเร็จ", "เจ้าหน้าที่ติดต่อผู้รับไม่ได้", "ปิดประกาศ ณ ที่ทำการรับฝาก : กรุณาติดต่อ THP contact center 1545", "ผู้ฝากส่งขอถอนคืน / ยกเลิกการรับฝาก", "จัดส่งไม่สำเร็จ/Delivery Failed", "ส่งคืนต้นทาง"],
        }
    ]

    useEffect(() => {
        if (status == "dashboard") {
            getDataPending();
        }
    }, [status]);

    let statusTextBox = [
        {
            label: "1.Sorting center",
            status: ["ออกจากคลังสินค้าเรียบร้อยแล้ว"],
        },
        {
            label: "2.อยู่ระหว่างขนส่ง",
            status: ["รับเข้า ณ ศูนย์คัดแยก", null, "รับเข้า Sorting Center หลักสี่เรียบร้อย", "แช่เก็บไว้ที่คลัง Fuze post", "รับฝาก"],
        },
        {
            label: "3.ถึงปณ.ปลายทาง",
            status: ["ออกจากที่ทำการ/ศูนย์ไปรษณีย์"],
        },
        // {
        //     label: "4.รับเข้า ศป.ปลายทาง",
        //     status: ["ถึงที่ทำการไปรษณีย์", "รับเข้า ณ ศูนย์คัดแยก"],
        // },
        {
            label: "4.อยู่ระหว่างนำจ่าย",
            status: ["ถึงที่ทำการไปรษณีย์", "อยู่ระหว่างการนำจ่าย", "อยู่ระหว่างการจัดส่ง/Delivery", "เจ้าหน้าที่ติดต่อผู้รับ"],
        },
        {
            label: "5.จัดส่งสำเร็จ",
            status: ["นำจ่ายสำเร็จ", "จัดส่งสำเร็จ/Delivery Successful"],
            border: '5px solid  #00A396'
        },
        {
            label: "6.จัดส่งไม่สำเร็จ",
            status: ["นำจ่ายไม่สำเร็จ", "เจ้าหน้าที่ติดต่อผู้รับไม่ได้", "ปิดประกาศ ณ ที่ทำการรับฝาก : กรุณาติดต่อ THP contact center 1545", "ผู้ฝากส่งขอถอนคืน / ยกเลิกการรับฝาก", "จัดส่งไม่สำเร็จ/Delivery Failed", "ส่งคืนต้นทาง"],
            border: '5px solid  #FF4560'
        },
        {
            label: "7.จัดส่งใหม่",
            status: [""],
            border: '5px solid  #FEB019'
        }
    ]

    const getDataPending = async () => {
        try {
            Swal.showLoading();
            const result = await ApiUsers.GetDeliveryKPIDeliveryStatus({
                startDate: state.fromdate,
                endDate: state.todate
            });
            Swal.close();
            if (result.status === 200) {
                const { data } = result;
                setDeliveryKPIData({
                    ...deliveryKPIData,
                    kpiToday: data?.kpiToday
                });
                if (data?.kpiToday.parcels) {
                    console.log('data?.kpiToday.customersData[0]:', data?.kpiToday.parcels)
                    setData(data?.kpiToday.parcels);
                }
                console.log(_.groupBy(data?.kpiToday.parcels, 'status_description'))
                setdataTable([
                    {
                        zone: 'BKK & Metro',
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "กรุงเทพ และ ปริมณฑล")?.length ?? 0,
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "กรุงเทพ และ ปริมณฑล"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "กรุงเทพ และ ปริมณฑล" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "กรุงเทพ และ ปริมณฑล" && statusText[5].status.includes(x.status_description))?.length ?? 0
                        // North: data?.kpiToday.parcels.find(x => x.zone_origin == "กรุงเทพ และ ปริมณฑล" && x.zone_destination == "ภาคเหนือ")?.length ?? 0,
                        // 'North East': data?.kpiToday.parcels.find(x => x.zone_origin == "กรุงเทพ และ ปริมณฑล" && x.zone_destination == "ภาคตะวันออกเฉียงเหนือ")?.length ?? 0,
                        // South: data?.kpiToday.parcels.find(x => x.zone_origin == "กรุงเทพ และ ปริมณฑล" && x.zone_destination == "ภาคใต้")?.length ?? 0,
                        // West: data?.kpiToday.parcels.find(x => x.zone_origin == "กรุงเทพ และ ปริมณฑล" && x.zone_destination == "ภาคตะวันตก")?.length ?? 0,
                        // Total: CurrencyThai(_.sum(data?.kpiToday.parcels.filter(x => x.zone_origin == "กรุงเทพ และ ปริมณฑล").map(x => Number(x.length.replace("%", "")))), 2) + "%",
                    },
                    {
                        zone: 'South',
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคใต้")?.length ?? 0,
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคใต้"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคใต้" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคใต้" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                    {
                        zone: 'East',
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออก"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออก")?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออก" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออก" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                    {
                        zone: 'West',
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันตก"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันตก")?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันตก" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันตก" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                    {
                        zone: 'Central',
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคกลาง"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคกลาง")?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคกลาง" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคกลาง" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                    {
                        zone: 'North East',
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออกเฉียงเหนือ"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออกเฉียงเหนือ")?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออกเฉียงเหนือ" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคตะวันออกเฉียงเหนือ" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                    {
                        zone: 'North',
                        inprogress: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคเหนือ"
                            && (
                                statusText[0].status.includes(x.status_description)
                                || statusText[1].status.includes(x.status_description)
                                || statusText[2].status.includes(x.status_description)
                                || statusText[3].status.includes(x.status_description)

                            )
                        )?.length ?? 0,
                        length: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคเหนือ")?.length ?? 0,
                        success: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคเหนือ" && statusText[4].status.includes(x.status_description))?.length ?? 0,
                        failure: data?.kpiToday.parcels.filter(x => x.zone_destination == "ภาคเหนือ" && (statusText[5].status.includes(x.status_description)))?.length ?? 0
                    },
                ])
            }
        } catch (error) {
            console.log(error)
        }
    };

    const filterDeliveryStatus = async (day) => {
        try {
            Swal.showLoading();
            const result = await ApiUsers.GetDeliveryKPIDeliveryStatusDate({
                ...state,
                delivery_date_add: day
            });
            Swal.close()
            if (result.status === 200) {
                const { data } = result;
                setDeliveryKPIData({
                    ...deliveryKPIData,
                    kpiDate: {
                        parcels: data?.kpiToday.parcels,
                        customers: data?.kpiToday.customers,
                        customersData: data?.kpiToday.customersData
                    },
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportByStatus = async (item) => {
        try {
            Swal.showLoading();
            const result = await ApiUsers.ExportDeliveryKPIDeliveryStatus({
                ...state,
                status: item.status
            }, "Export Excel DropOff Order Summary Report");
            Swal.close()
            if (result.status === 200) {
                window.open(result.data);
            }
        } catch (error) {
            Swal.SwalClose();
            Swal.SwalErr(error);
        }
    }






    return (
        <div>
            <Toaster
                reverseOrder={false}
            />
            <div className="flex justify-between items-center h-20 lg:h-28 ml-5 lg:ml-24 pr-5 lg:pr-24 bg-gradient-to-r from-blue-secondary to-blue-neon rounded-tl-100 gap-3">
                <div className='flex'>
                    <img className="ml-3 lg:ml-7 -mb-20 lg:mt-5 h-20 lg:h-24 border-8 border-white bg-white rounded-full" src="/assets/icons/smile.svg" />
                    <div className="flex flex-col -mb-7 lg:mt-7 ml-3">
                        <label className="text-white lg:text-md">ยินดีต้อนรับ</label>
                        <label className="text-blue-primary text-lg lg:text-xl font-bold">{userState.name}</label>
                    </div>
                </div>
                <Link href="profile/edit">
                    <div className='bg-blue-primary rounded-full text-white px-2 lg:px-3 py-1 -mb-20 lg:mt-6'>
                        <button className='flex text-xs lg:text-base items-center'>
                            <img className="h-5 lg:h-7 mr-2" src="/assets/icons/cog.svg" />
                            จัดการบัญชี
                        </button>
                    </div>
                </Link>
            </div>
            <div className='px-5 lg:px-24 pt-14'>
                <div className='flex gap-3 items-center'>
                    <img className="h-5 lg:h-10" src="/assets/icons/box.svg" />
                    <label className="text-blue-primary lg:text-xl font-semibold">รายการส่งสินค้า</label>
                </div>
            </div>
            <div className='px-5 lg:px-24 py-3'>
                <div className={`grid grid-cols-3 ${userState.is_dashboard ? 'sm:grid-cols-6' : 'sm:grid-cols-5'} items-center text-xs lg:text-base font-semibold`}>
                    <div className={`flex justify-center py-2 ${status == 'all' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('all') }}>
                        <label className='cursor-pointer hover:text-black-text'>ทั้งหมด</label>
                    </div>
                    <div className={`flex justify-center py-2 ${status == 'shipping' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('shipping') }}>
                        <label className='cursor-pointer hover:text-black-text'>อยุ่ระหว่างขนส่ง</label>
                    </div>
                    <div className={`flex justify-center py-2 ${status == 'success' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('success') }}>
                        <label className='cursor-pointer hover:text-black-text'>สำเร็จ</label>
                    </div>
                    <div className={`flex justify-center py-2 ${status == 'fail' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('fail') }}>
                        <label className='cursor-pointer hover:text-black-text'>นำจ่ายไม่สำเร็จ</label>
                    </div>
                    <div className={`flex justify-center py-2 ${status == 'claim' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('claim') }}>
                        <label className='cursor-pointer hover:text-black-text'>เคลม/ร้องเรียน</label>
                    </div>
                    {
                        userState.is_dashboard && <div className={`flex justify-center py-2 ${status == 'dashboard' ? 'text-blue-primary border-b-2 border-b-blue-secondary' : 'text-gray-text border-b-2 border-b-gray-thin'}`} onClick={() => { setStatus('dashboard') }}>
                            <label className='cursor-pointer hover:text-black-text'>Dashboard</label>
                        </div>
                    }

                </div>
            </div>
            <div className='px-5 lg:px-24 pb-3 flex flex-col md:flex-row gap-3 items-center'>
                <div className='flex justify-between form-control w-full md:w-fit'>
                    <input value={state.order_code} onChange={(e) => {
                        setstate({
                            ...state,
                            order_code: e.target.value
                        })
                    }} className='w-full md:w-28 lg:w-full' placeholder='ค้นหาจากเลขที่ Order' />
                    <img className="h-5 lg:h-5" src="/assets/icons/barcode.svg" />
                </div>
                {/* <div className='flex justify-between border-2 rounded-lg p-3 text-xs lg:text-base'>
                    <input className='w-28 lg:w-full' placeholder='วันที่เข้ารับสินค้า' />
                    <img className="h-5 lg:h-7" src="/assets/icons/calendar.svg" />
                </div> */}
                <div className='flex flex-1 gap-x-2 items-center w-full md:w-fit'>
                    <DatePicker
                        // minDate={moment().format('HH') >= 12 ? moment().add(1, 'day').toDate() : moment().toDate()}
                        // maxDate={moment().add(10, 'day').toDate()}
                        placeholderText='วันที่เข้ารับสินค้า'
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-full"
                        selected={state.fromdate ? moment(state.fromdate).toDate() : ""}
                        onChange={(date) => {
                            setstate({
                                ...state,
                                fromdate: date
                            })
                        }} />
                    <label>ถึง</label>
                    <DatePicker
                        // minDate={moment().format('HH') >= 12 ? moment().add(1, 'day').toDate() : moment().toDate()}
                        // maxDate={moment().add(10, 'day').toDate()}
                        placeholderText='วันที่เข้ารับสินค้า'
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-full"
                        selected={state.todate ? moment(state.todate).toDate() : ""}
                        onChange={(date) => {
                            setstate({
                                ...state,
                                todate: date
                            })
                        }} />
                </div>
                <div className='w-full md:w-fit'>
                    <a onClick={() => {
                        if (status !== 'dashboard') {
                            getHistoryOrder();
                        } else {
                            getDataPending();
                        }

                    }} className='cursor-pointer flex border border-blue-primary rounded text-blue-primary px-5 py-2 md:ml-5 justify-center'>
                        <SearchIcon className='h-6 w-6 text-blue-primary' />
                        ค้นหา
                    </a>
                </div>
            </div>
            {
                status !== 'claim' && status !== 'dashboard' && <>

                    <div className='px-5 lg:px-24 py-5 gap-y-5 flex flex-col'>
                        <div className='flex justify-end'>
                            <a onClick={() => {
                                onExportOrderSummary();
                            }} className='cursor-pointer flex border border-blue-primary rounded text-blue-primary px-5 py-2 ml-5'>
                                <img className="h-6 mr-3" src="/assets/icons/file.svg" />
                                ดาวน์โหลด (Excel)
                            </a>
                        </div>
                        {
                            ordersFilters.map((order, orderIndex) => {
                                return <div key={`order-${orderIndex}`} className='border-2 rounded-lg'>
                                    <div className='flex justify-between px-2 lg:px-5 py-3'>
                                        <div className='flex items-center'>
                                            <img className="h-5 mr-2" src="/assets/icons/shipping-fast-blue.svg" />
                                            <label className='text-xss lg:text-sm text-blue-primary font-semibold'>{`เข้ารับสินค้าวันที่ ${ConvertDateShortThai(order.book_date, "DD MMM YY")}  ${order.book_period} น.`}</label>
                                        </div>
                                        {getStatusOrder(order)}
                                    </div>
                                    <hr className='border' />

                                    <div className='px-2 lg:px-5 py-3'>
                                        <div className='flex justify-between'>
                                            <label className='text-xs lg:text-base font-semibold'>
                                                เลขที่ Order : {order.order_code}
                                            </label>
                                            <label className='text-xs lg:text-base text-blue-primary font-semibold italic'>
                                                ต้นทาง : {order.sender_province}
                                                {/* ปลายทาง : {order.recv_province} */}
                                            </label>
                                        </div>
                                        {
                                            order.items.map((item, index) => {
                                                return <div key={`item-${index}`} className='flex justify-between py-5'>
                                                    <div className='flex items-center'>
                                                        <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                                        <div className='flex flex-col'>
                                                            <label className="text-xs lg:text-base font-semibold">
                                                                {item.type_name} {`(${item.service_name})`} {`${item.tracking_ref}`}
                                                            </label>
                                                            <label className="text-xs lg:text-base font-semibold">
                                                                Size : {item.size_name} &nbsp;&nbsp; {item.price_amt} บาท {item.is_insurance && item.insurance_price > 0 ? `(ประกัน ${CurrencyThai(item.insurance_price)} บาท)` : ``}
                                                                {item.island_price > 0 ? `(พื้นที่ห่างไกล ${CurrencyThai(item.island_price)} บาท)` : ``}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='self-end'>
                                                        <label className="text-xs lg:text-base font-semibold">
                                                            จำนวน : {parseInt(item.qty_amt)}
                                                        </label>
                                                    </div>
                                                </div>
                                            })
                                        }

                                        <div className='flex flex-col items-end'>
                                            <div className='flex items-end'>
                                                <label className='text-xs lg:text-base font-semibold'>รวมทั้งสิ้น ({order.box_amt} กล่อง)&nbsp; : &nbsp;</label>
                                                <label className='font-semibold lg:text-lg'>{CurrencyThai(order.order_price_amt)} บาท</label>
                                            </div>
                                        </div>
                                        <div className='flex justify-between lg:justify-between'>
                                            <div className='flex my-2'>
                                                {
                                                    getButtonOrder(order)
                                                }
                                            </div>
                                            <div className='my-2'>
                                                <Link href={`/profile/order/${order.order_code}`}>
                                                    <button className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                                        <img className="h-4 mr-2" src="/assets/icons/eye.svg" />
                                                        ดูรายละเอียด
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>
            }
            {
                status === 'claim' && <>

                    <div className='px-5 lg:px-24 py-5 gap-y-5 flex flex-col'>
                        {
                            cliamOrders.map((order, orderIndex) => {
                                {
                                    return order.order_type == "claim" ?
                                        (<div key={`order-${orderIndex}`} className='border-2 rounded-lg'>
                                            <div className='flex justify-between px-2 lg:px-5 py-3'>
                                                <div className='flex items-center'>
                                                    <img className="h-5 mr-2" src="/assets/icons/shipping-fast-blue.svg" />
                                                    <label className='text-xss lg:text-sm text-blue-primary font-semibold'>{`แจ้งขอคืนสินค้าวันที่ ${ConvertDateShortThai(order.createdate, "DD MMM YY HH:mm น.")}`}</label>
                                                </div>

                                            </div>
                                            <hr className='border' />

                                            <div className='px-2 lg:px-5 py-3'>
                                                <div className='flex justify-between'>
                                                    <label className='text-xs lg:text-base font-semibold'>
                                                        เลขที่ Order : {order.order_code}
                                                    </label>
                                                    <label className='text-xs lg:text-base text-blue-primary font-semibold italic'>
                                                        ต้นทาง : {order.sender_province}
                                                        {/* ปลายทาง : {order.recv_province} */}
                                                    </label>
                                                </div>
                                                {
                                                    order.items.map((item, index) => {
                                                        return <div key={`item-${index}`} className='flex justify-between py-5'>
                                                            <div className='flex items-center min-w-[200px]'>
                                                                <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                                                <div className='flex flex-col'>
                                                                    <label className="text-xs lg:text-base font-semibold">
                                                                        {item.type_name} {`(${item.service_name}) ${item.tracking_ref}`}
                                                                    </label>
                                                                    <label className="text-xs lg:text-base font-semibold">
                                                                        Size : {item.size_name} &nbsp;&nbsp; {item.price_amt} บาท
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {getStatusClaimOrder(item)}
                                                        </div>
                                                    })
                                                }
                                                <div className='flex justify-between lg:justify-between'>
                                                    <div className='flex my-2'>
                                                    </div>
                                                    <div className='my-2'>
                                                        <Link href={`/profile/claim/detail/${order.id}`}>
                                                            <button className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                                                <img className="h-4 mr-2" src="/assets/icons/eye.svg" />
                                                                ดูรายละเอียด
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ) : (<div key={`order-complain-${orderIndex}`} className='border-2 rounded-lg'>
                                            <div className='flex justify-between px-2 lg:px-5 py-3'>
                                                <div className='flex items-center'>
                                                    <img className="h-5 mr-2" src="/assets/icons/shipping-fast-blue.svg" />
                                                    <label className='text-xss lg:text-sm text-blue-primary font-semibold'>{`ร้องเรียนวันที่ ${ConvertDateShortThai(order.createdate, "DD MMM YY HH:mm น.")}`}</label>
                                                </div>
                                                {getStatusComplainOrder(order)}
                                            </div>
                                            <hr className='border' />

                                            <div className='px-2 lg:px-5 py-3'>
                                                <div className='flex justify-between'>
                                                    <label className='text-xs lg:text-base font-semibold'>
                                                        เลขที่ Order : {order.order_code}
                                                    </label>
                                                    <label className='text-xs lg:text-base text-blue-primary font-semibold italic'>
                                                        ต้นทาง : {order.sender_province}
                                                        {/* ปลายทาง : {order.recv_province} */}
                                                    </label>
                                                </div>
                                                <div className='flex justify-between lg:justify-between'>
                                                    <div className='flex my-2'>
                                                        <div className='flex flex-col'>
                                                            <label className='text-sm'>
                                                                <label className='font-semibold'>หัวข้อร้องเรียน: </label>{order.complain}
                                                            </label>
                                                            <label className='text-sm'>
                                                                <label className='font-semibold'>รายละเอียด: </label>{order.complain_note}
                                                            </label>
                                                        </div>

                                                    </div>
                                                    <div className='my-2'>
                                                        <Link href={`/profile/complain_order/detail/${order.id}`}>
                                                            <button className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                                                <img className="h-4 mr-2" src="/assets/icons/eye.svg" />
                                                                ดูรายละเอียด
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                }

                            })
                        }
                    </div>
                </>
            }
            {
                status === 'dashboard' && <>

                    <div className='px-5 lg:px-24 py-5 gap-y-5 flex flex-col'>
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                                    <h3 className='title mr-3'>1) Delivery Status</h3>
                                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1, flexWrap: 'wrap', display: 'flex' }}>
                                            <div style={{ minWidth: '150px', marginRight: 40, display: 'flex', flexDirection: 'column' }} className={`status-card text-center status-card-${0}`} key={0}>
                                                <label style={{ fontSize: 16 }}>Total</label>
                                                <label style={{ fontSize: 24 }}>{CurrencyThai(data.length, 0)}</label>
                                            </div>
                                            <div onClick={() => {
                                                // filterDeliveryStatus(0);
                                            }} style={{ minWidth: '150px', cursor: 'pointer', marginRight: 40, display: 'flex', flexDirection: 'column' }} className={`status-card text-center status-card-${0}`} key={0}>
                                                <label style={{ fontSize: 16 }}>D+1</label>
                                                <label style={{ fontSize: 24 }}>{CurrencyThai(data.length, 0)}</label>
                                            </div>
                                            <div onClick={() => {
                                                // filterDeliveryStatus(1);
                                            }} style={{ minWidth: '150px', cursor: 'pointer', marginRight: 40, display: 'flex', flexDirection: 'column' }} className={`status-card text-center status-card-${0}`} key={0}>
                                                <label style={{ fontSize: 16 }}>D+2</label>
                                                <label style={{ fontSize: 24 }}>{0}</label>
                                            </div>
                                            <div onClick={() => {
                                                // filterDeliveryStatus(2);
                                            }} style={{ minWidth: '150px', cursor: 'pointer', marginRight: 40, display: 'flex', flexDirection: 'column' }} className={`status-card text-center status-card-${0}`} key={0}>
                                                <label style={{ fontSize: 16 }}>D+3</label>
                                                <label style={{ fontSize: 24 }}>{0}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='mt-2' style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ flex: 1, flexWrap: 'wrap', display: 'flex' }}>
                                            {
                                                statusTextBox.map((item, index) => (
                                                    <div className='' key={index + "_delivery"}

                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
                                                        }}
                                                    >
                                                        <div className="border p-2 text-center"
                                                            onClick={() => {
                                                                exportByStatus(item);
                                                            }}
                                                            style={{
                                                                // minWidth: item.label == "5.จัดส่งสำเร็จ" || item.label == "6.จัดส่งไม่สำเร็จ" || item.label == "7.จัดส่งใหม่" ? '300px' : '150px',
                                                                minWidth: 150,
                                                                border: item.label == "5.จัดส่งสำเร็จ" || item.label == "6.จัดส่งไม่สำเร็จ" || item.label == "7.จัดส่งใหม่" ? item.border : '',
                                                                //minHeight: item.label == "5.จัดส่งสำเร็จ" || item.label == "6.จัดส่งไม่สำเร็จ" || item.label == "7.จัดส่งใหม่" ? '300px' : '250px',
                                                                display: 'flex', marginLeft: 10, flexDirection: 'column'
                                                            }}>
                                                            <label className='font-bold' style={{
                                                                fontSize: item.label == "5.จัดส่งสำเร็จ" || item.label == "6.จัดส่งไม่สำเร็จ" || item.label == "7.จัดส่งใหม่" ? 20 : 14,

                                                            }}>
                                                                {item.label}</label>
                                                            <label className='font-bold text-2xl'>{deliveryKPIData.kpiToday.parcels.filter(x => item.status.includes(x.status_description))?.length ?? 0}</label>
                                                        </div>
                                                        {
                                                            (index + 1) != statusTextBox.length && <label style={{ fontSize: 30, color: '#321fdb' }}>
                                                                {`>`}
                                                            </label>
                                                        }

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    {
                                        deliveryKPIData.kpiToday &&
                                        <div className=''>
                                            <div>จัดส่งสำเร็จ</div>
                                            <div className='text-5xl text-center font-bold'>
                                                <>
                                                    {(
                                                        ((deliveryKPIData.kpiToday.parcels.filter(x => statusText[4]?.status?.includes(x.status_description))?.length || 0) /
                                                            (deliveryKPIData.kpiToday.parcels.length || 1)) * 100
                                                    ).toFixed(0)}
                                                    %
                                                </>
                                            </div>
                                            <div> สำเร็จ &nbsp;
                                                {deliveryKPIData?.kpiToday.parcels.filter(x => statusText[4].status.includes(x.status_description))?.length} / {deliveryKPIData?.kpiToday.parcels.length}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div >
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: 20, marginTop: 20 }}>
                            <div style={{ width: '40%' }}>
                                {/* <div style={{ justifyContent: 'space-between', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                    <h3 className='title'>2) Top 10 Customers : Delivery Status</h3>
                                    <div style={{ minWidth: '150px', display: 'flex', flexDirection: 'column' }} className={`status-card text-center status-card-${0}`} key={0}>
                                        <label style={{ fontSize: 14 }}>รอการนำจ่าย</label>
                                        <label>{_.sumBy(Object.values(deliveryKPIData.kpiToday.customersData), (customers) => customers.length)}</label>
                                    </div>
                                </div> */}
                                {/* <div className="table-responsive mt-3"> */}
                                <table className="table-auto overflow-scroll w-full tableA !font-sm">
                                    <thead>
                                        <tr>
                                            <th className='!text-sm !p-2' width="20%">ปลายทาง</th>
                                            <th className='!text-sm !p-2' width="20%">จำนวน Parcel</th>
                                            <th className='!text-sm !p-2' width="20%">อยู่ระหว่างการนำจ่าย</th>
                                            <th className='!text-sm !p-2' width="20%">จัดส่งสำเร็จ</th>
                                            <th className='!text-sm !p-2' width="20%">จัดส่งไม่สำเร็จ</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {dataTable.map((row, index) => (
                                            <tr key={index}>
                                                <td className='!text-sm !p-2 text-center'>{row.zone}</td>
                                                <td className='!text-sm !p-2'>{row.length}</td>
                                                <td className='!text-sm !p-2'>{row.inprogress}</td>
                                                <td className='!text-sm !p-2'>{row.success}</td>
                                                <td className='!text-sm !p-2'>{row.failure}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* </div> */}
                            </div>
                            <div style={{ width: '60%' }}>
                                <table className="table-auto overflow-scroll w-full tableA !font-sm">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th className='!text-sm !p-2' key={header.id}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <td className='!text-sm !p-2' key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Pagination Controls */}
                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                        {"<"} ก่อนหน้า
                                    </button>
                                    <span>
                                        หน้า {pageIndex + 1} จาก {table.getPageCount()}
                                    </span>
                                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                        ถัดไป {">"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                modalCancel && <CustomModal onClose={() => {
                    setmodalCancel(false)
                }}
                    //isCheck={isCheck}
                    onConfirm={() => {
                        cancelOrder()
                    }}
                    onChange={(e) => {
                        setmodalCancel(e.target.checked)
                    }}
                // termCondition={configContent.find(x => x.ct_code == 'term_condition')?.html_text ?? ""}
                // onConfirm={appointConfirmModal}
                >
                    <div className='flex items-center flex-center py-5'>
                        <label className='text-xl'>ท่านต้องการลบรายการนี้ใช่หรือไม่ ?</label>
                    </div>
                </CustomModal>
            }
        </div >
    );
};

export async function getServerSideProps({ params }) {

    const configContent = await ApiMasters.getConfigMaster();

    return {
        props: {

            configContent: configContent.data,
        }
    }
}

export default Profile;
