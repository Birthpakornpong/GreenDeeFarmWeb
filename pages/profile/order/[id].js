import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiOrders from "api/ApiOrders";
import { useEffect, useState } from "react";
import { ConvertDateShortThai, CurrencyThai, ValidateInput } from "utils";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import Link from "next/link";
import FileDownload from 'js-file-download'
import Modal from "@components/CustomModal/CustomModal";
import QRCode from "react-qr-code";
import moment from 'moment';

const OrderDetailPage = ({ id, order, addresses = [], configContent = [] }) => {
    const dispatch = useDispatch();
    const [configPeriodDate, setconfigPeriodDate] = useState(0);
    const [profile, setprofile] = useState({
        addresses: [],
        defaultSender: "",
        defaultReceive: ""
    });
    const [thAddress, setThAddress] = useState([]);
    const router = useRouter()
    const [checkSelected, setcheckSelected] = useState([]);
    const [state, setState] = useState({
        claimtype_id: "",
        claim_note: ""
    });
    const [stateTax, setStateTax] = useState({
        order_code: "",
        is_tax_invoice: true,
        tax_tax: "",
        tax_name: "",
        tax_tel: "",
        tax_address: "",
        tax_province: "",
        tax_district: "",
        tax_subdistrict: "",
        tax_zipcode: "",
    });
    useEffect(() => {
        getProfile();
        let thAddressList = [];
        addresses.map((item, index) => {
            item.subDistrictList.map((subitem, subIndex) => {
                let district = item.districtList.find(x => x.districtId == subitem.districtId);
                let province = item.provinceList.find(x => x.provinceId == subitem.provinceId)
                thAddressList.push({
                    value: `${item.zipCode}_${subitem.subDistrictName}_${district.districtName}_${province.provinceName}`,
                    label: `${item.zipCode}, ${subitem.subDistrictName}, ${district.districtName}, ${province.provinceName}`
                })
            })
        });
        setThAddress(thAddressList);
        if (configContent.find(x => x.config_code == "claim_period_date")) {
            setconfigPeriodDate(parseInt(configContent.find(x => x.config_code == "claim_period_date").config_value))
        }
    }, []);

    const getProfile = async () => {
        const result = await ApiUsers.getUserProfile();
        if (result.status == 200) {
            dispatch({ type: "set", user: result.data.userData });
            const sender = result.data.userData.addresses.find(x => x.type == "S" && x.is_default == true);
            const receive = result.data.userData.addresses.find(x => x.type == "R" && x.is_default == true);
            result.data.userData.defaultSender = sender;
            result.data.userData.defaultReceive = receive;
            let newState = { ...state };
            if (receive) {
                const modelReceive = [{
                    recv_code: `${receive.zipcode?.trim()}_${receive.subdistrict?.trim()}_${receive.district?.trim()}_${receive.province?.trim()}`,
                    recv_name: receive.name,
                    recv_address: receive.address,
                    recv_subdistrict: receive.subdistrict,
                    recv_district: receive.district,
                    recv_province: receive.province,
                    recv_zipcode: receive.zipcode,
                    recv_tel: receive.phone,
                    recv_tel2: receive.phone2,
                    recv_id: +new Date() + 1,
                    items: [],
                }];

                newState = {
                    ...newState,
                    receive_list: modelReceive
                    // recv_id: receive.id,
                    // recv_name: receive.name,
                    // recv_tel: receive.phone,
                    // recv_tel2: receive.phone2 ?? "",
                    // recv_address: receive.address,
                    // recv_province: receive.province,
                    // recv_district: receive.district,
                    // recv_subdistrict: receive.subdistrict,
                    // recv_zipcode: receive.zipcode,
                }
            }
            if (sender) {
                newState = {
                    ...newState,
                    sender_code: `${sender.zipcode?.trim()}_${sender.subdistrict?.trim()}_${sender.district?.trim()}_${sender.province?.trim()}`,
                    sender_id: sender.id,
                    sender_name: sender.name,
                    sender_tel: sender.phone,
                    sender_tel2: sender.phone2 ?? "",
                    sender_address: sender.address,
                    sender_province: sender.province,
                    sender_district: sender.district,
                    sender_subdistrict: sender.subdistrict,
                    sender_zipcode: sender.zipcode,
                }
            }
            setStateTax({
                ...stateTax,
                sender_code: newState?.sender_code,
                tax_address: newState?.sender_address,
                tax_district: newState?.sender_district,
                tax_subdistrict: newState?.sender_subdistrict,
                tax_province: newState?.sender_province,
                tax_tel: newState?.sender_tel,
                tax_tax: result.data.userData?.tax_id,
                tax_name: result.data.userData?.name
            })
            //setState(newState);
            //setprofile(result.data.userData);

        }
    }

    const [isModalQrCode, setisModalQrCode] = useState(false);
    const [isModalTaxInvoice, setisModalTaxInvoice] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({

    });

    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["claimtype_id"]) {
            formIsValid = false;
            errors["claimtype_id"] = "กรุณาเลือกเหตุผลในการขอคืนสินค้า";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidation();
        if (isValid) {
            if (checkSelected.length == 0) {
                toast.error("กรุณาเลือกรายการขอคืนสินค้า อย่างน้อย 1 รายการ", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
            }
            if (state.image) {
                formData.append('files', state.image);
            }
            formData.append('state', JSON.stringify(
                {
                    ...state,
                    order_id: order.id,
                    cust_id: order.cust_id,
                    number_of_damaged: checkSelected.length,
                    items: checkSelected,
                    order_ref: order.order_code
                }
            ));
            const result = await ApiOrders.cliamOrder(formData, order.order_code);
            toast.dismiss();
            const { status } = result;
            if (status == 200) {
                toast.success('บันทึกสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                })
                const successTimeout = setTimeout(() => router.push('/profile'), 2000)
                return () => clearTimeout(successTimeout)
            }
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

    const printTracking = async (item) => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const response = await ApiOrders.printTracking([item.item_ref]);
        if (response.status == 200) {
            var file = new Blob([response.data], { type: 'application/pdf' }, `${item.item_ref}.pdf`);
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }
        toast.dismiss();
    }

    const printTrackingAll = async () => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const response = await ApiOrders.printTracking(order.items.map(x => x.item_ref));
        if (response.status == 200) {
            var file = new Blob([response.data], { type: 'application/pdf' }, `${order.order_code}.pdf`);
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }
        toast.dismiss();
    }

    const printReceipt = async () => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const response = await ApiOrders.printReceipt(order.order_code);
        if (response.status == 200) {
            var file = new Blob([response.data], { type: 'application/pdf' }, `${order.order_code}_receipt.pdf`);
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }
        toast.dismiss();
    }

    const printInvoice = async () => {
        var isValid = handleValidationTax();
        if (isValid) {
            toast.loading('กรุณารอสักครู่', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            const result = await ApiOrders.UpdateOrderTaxInvoice({
                ...stateTax,
                order_code: order.order_code
            });
            const { data, status } = result;
            if (status == 200) {
                // dispatch({ type: "set", appointData: {} });
                toast.success('บันทึกสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                })
                setisModalTaxInvoice(false);
                toast.dismiss();
                try {
                    const result2 = await ApiOrders.printInvoice({ order_code: order.order_code });
                    var file = new Blob([result2.data], { type: 'application/pdf' }, `${order.order_code}_TaxInvoice.pdf`);
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                } catch (error) {

                }

            } else {
                toast.dismiss();
            }

        }

        // const response = await ApiOrders.printReceipt(order.order_code);
        // if (response.status == 200) {
        //     var file = new Blob([response.data], { type: 'application/pdf' }, `${order.order_code}_receipt.pdf`);
        //     var fileURL = URL.createObjectURL(file);
        //     window.open(fileURL);
        // }
        // toast.dismiss();
    }


    const handleValidationTax = () => {
        let fields = stateTax;
        let errors = {};
        let formIsValid = true;
        if (!fields["tax_name"]) {
            formIsValid = false;
            errors["tax_name"] = "กรุณากรอกข้อมูล";
        }

        if (!fields["tax_tax"]) {
            formIsValid = false;
            errors["tax_tax"] = "กรุณากรอกข้อมูล";
        } else {
            if (fields["tax_tax"].length < 13) {
                errors["tax_tax"] = "รูปแบบไม่ถูกต้อง";
            }
            // errors["tax_tax"] = ValidateInput(fields["tax_tax"], "idcard");
            // if (errors.tax_tax) formIsValid = false;
        }
        if (!fields["tax_tel"]) {
            formIsValid = false;
            errors["tax_tel"] = "กรุณากรอกข้อมูล";
        } else {
            errors["tax_tel"] = ValidateInput(fields["tax_tel"], "mobile");
            if (errors.tax_tel) formIsValid = false;
        }

        if (!fields["tax_address"]) {
            formIsValid = false;
            errors["tax_address"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["tax_district"]) {
            formIsValid = false;
            errors["tax_district"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["tax_subdistrict"]) {
            formIsValid = false;
            errors["tax_subdistrict"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["tax_province"]) {
            formIsValid = false;
            errors["tax_province"] = "กรุณากรอกข้อมูล";
        }
        // if (!fields["zipcode"]) {
        //     formIsValid = false;
        //     errors["zipcode"] = "กรุณากรอกข้อมูล";
        // }
        setFieldErrors(errors);
        return formIsValid;
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
        else if ((item.order_status == "P" || item.order_status == 'PU' || item.order_status == 'ID')) {
            if ((parseFloat(item.order_price_amt) > parseFloat(item.payment_amt)) && (item.is_credit == false && !item.dropoff_code)) {
                return <div className='flex gap-x-2'>
                    <button onClick={() => {
                        paymentOver(item)
                    }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                        <img className="h-4 mr-2" src="/assets/icons/basket.svg" />
                        ชำระเงินเพิ่ม ({CurrencyThai(item.order_price_amt - item.payment_amt)})
                    </button>
                    {/* <Link href={`/profile/claim/${item.order_code}`}>
                        <button onClick={() => {
                        }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                            เคลมสินค้า
                        </button>
                    </Link>
                    <Link href={`/profile/complain_order/${item.order_code}`}>
                        <button onClick={() => {
                        }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                            ร้องเรียน
                        </button>
                    </Link> */}
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


    useEffect(() => {
        console.log(order)
    }, []);

    return <div>
        {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
        <div className="container mx-auto px-4 mt-7 gap-y-4 flex flex-col">
            <form className="gap-y-4 flex flex-col" onSubmit={submit}>
                <div className="flex justify-between">
                    <div onClick={() => {
                        setisModalQrCode(true)
                    }} className="flex items-center cursor-pointer">
                        <img src="/assets/icons/barcode.svg" className="h-8 w-8" />
                        <label className="text-gray-text ml-2 font-bold">{order.order_code}</label>
                    </div>
                    {getStatusOrder(order)}
                </div>
                <div className="border rounded-lg divide-y ">
                    <div className="flex flex-col p-4 flex-wrap gap-y-4">
                        <h4>ผู้ส่งสินค้า</h4>
                        <div>
                            <div className='flex gap-3 lg:gap-5'>
                                <img className="h-8 lg:h-10" src="/assets/images/location.webp" />
                                <div className='flex flex-col lg:gap-3'>
                                    <div className='flex gap-3 lg:gap-5'>
                                        <label className="text-xs lg:text-sm font-semibold">{order.sender_name}</label>
                                        <label className="text-gray-text text-xs lg:text-sm font-semibold">Tel : {order.sender_tel}</label>
                                    </div>
                                    <label className="text-xs lg:text-sm w-56 sm:w-auto">{`${order.sender_address} ${order.sender_subdistrict} ${order.sender_district} ${order.sender_province} ${order.sender_zipcode}`}</label>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-4 flex-wrap">
                        <div>
                            <h4>เลขที่ Order : {id}</h4>
                            <label className="text-blue-primary italic">{`ต้นทาง ${order.sender_province}`}</label>
                        </div>
                        <div className="flex gap-x-2">
                            {/* {
                                (order.order_status == "P" || order.order_status == 'PU' || order.order_status == 'ID') && <button onClick={() => {
                                    setisModalTaxInvoice(true);
                                }} className='bg-blue-primary h-fit flex text-sm text-white items-center border py-1 px-3 rounded-full w-fit'>
                                    ใบกำกับภาษี
                                </button>
                            } */}
                            {
                                (order.order_status == "P" || order.order_status == 'PU' || order.order_status == 'ID') && <button onClick={() => {
                                    printReceipt();
                                }} className='bg-blue-primary h-fit flex text-sm text-white items-center border py-1 px-3 rounded-full w-fit'>
                                    ใบเสร็จรับเงิน
                                </button>
                            }
                            {
                                order.order_status != "WP" && <button onClick={() => {
                                    printTrackingAll();
                                }} className='bg-blue-primary h-fit flex text-sm text-white items-center border py-1 px-3 rounded-full w-fit'>
                                    ใบปะหน้าสินค้าทั้งหมด
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col p-4 gap-y-2">
                        <div className="flex justify-between">
                            <label>ทำการสั่งซื้อ</label>
                            <label>{ConvertDateShortThai(order.createdate, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>{
                            order?.payment && <div className="flex justify-between">
                                <label>ชำระเงิน</label>
                                <label>{ConvertDateShortThai(order?.payment?.trade_time, "วันที่ DD MMM YY HH:ss น.")}</label>
                            </div>
                        }

                    </div>
                    <div className="flex flex-col justify-between p-4 gap-y-4">
                        {
                            order.receive_list.map((recv, index) => {
                                return <>
                                    <div key={recv.recv_id} className="flex flex-col p-4 flex-wrap gap-y-4">
                                        <h4>ผู้รับสินค้า</h4>
                                        <div>
                                            <div className='flex gap-3 lg:gap-5'>
                                                <img className="h-8 lg:h-10" src="/assets/images/location.webp" />
                                                <div className='flex flex-col lg:gap-3'>
                                                    <div className='flex gap-3 lg:gap-5'>
                                                        <label className="text-xs lg:text-sm font-semibold">{recv.recv_name}</label>
                                                        <label className="text-gray-text text-xs lg:text-sm font-semibold">Tel : {recv.recv_tel}</label>
                                                    </div>
                                                    <label className="text-xs lg:text-sm w-56 sm:w-auto">{`${recv.recv_address} ${recv.recv_subdistrict} ${recv.recv_district} ${recv.recv_province} ${recv.recv_zipcode}`}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        order.items.filter(x => x.recv_id == recv.recv_id).map((item, index) => {
                                            let components = [];
                                            for (let i = 0; i < item.qty_amt; i++) {
                                                components.push(<div key={`item-${index}-${i}`} className='flex flex-1 flex-col'>
                                                    <div className='flex items-center flex-1'>
                                                        <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                                        <div className='flex flex-col flex-1'>
                                                            <label className="text-xs lg:text-base font-semibold">
                                                                {item.type_name} {`(${item.service_name})`} {`${item.tracking_ref}`}
                                                            </label>
                                                            <div className="flex justify-between flex-1">
                                                                <div className="flex items-center">
                                                                    <label className="text-xs lg:text-base">
                                                                        Size : {item.size_name} &nbsp;&nbsp;
                                                                    </label>
                                                                    {
                                                                        order.order_status != 'WP' && <button onClick={() => {
                                                                            printTracking(item);
                                                                        }} className='bg-blue-primary flex text-sm text-white items-center border py-1 px-3 rounded-full w-fit'>
                                                                            ใบปะหน้าสินค้า
                                                                        </button>
                                                                    }

                                                                </div>
                                                                <label className="text-xs lg:text-base font-regular">
                                                                    {item.price_amt} บาท
                                                                    {item.is_insurance && item.insurance_price > 0 ? ` (ประกัน ${CurrencyThai(item.insurance_price)} บาท)` : ``}
                                                                    {item.island_price > 0 ? ` (พื้นที่ห่างไกล ${CurrencyThai(item.island_price)} บาท)` : ``}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            }
                                            return components;
                                        })
                                    }
                                </>
                            })
                        }

                    </div>
                    <div className='flex flex-col items-end p-4'>
                        <div className='flex items-end'>
                            <label className='text-xs lg:text-base font-regular'>รวมทั้งสิ้น ({order.box_amt} กล่อง)&nbsp; : &nbsp;</label>
                            <label className='font-regular lg:text-lg'>{CurrencyThai(parseFloat(order.order_price_amt) - parseFloat(order.insurance_amt) - parseFloat(order.delivery_amt) - parseFloat(order.island_price ?? 0) + parseFloat(order.discount_amt))} บาท</label>
                        </div>
                        {
                            order.insurance_amt && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>ค่าประกันความเสียหาย &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.insurance_amt)} บาท</label>
                            </div>
                        }
                        {
                            order.delivery_amt && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>ค่าขนส่ง &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.delivery_amt)} บาท</label>
                            </div>
                        }
                        {
                            order.discount_amt && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>ส่วนลดทั้งหมด &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.discount_amt)} บาท</label>
                            </div>
                        }
                        {
                            order.island_price > 0 && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>พื้นที่ห่างไกล &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.island_price)} บาท</label>
                            </div>
                        }
                        <div className='flex items-end'>
                            <label className='text-xs lg:text-base font-semibold'>ราคาสุทธิ &nbsp; : &nbsp;</label>
                            <label className='font-semibold lg:text-lg'>{CurrencyThai(order.order_price_amt)} บาท</label>
                        </div>
                    </div>
                    <div className="p-5">
                        {/* <div className='flex'>
                            {
                                order.order_status == "P" && <div className="flex gap-x-2">
                                    <Link href={`/profile/claim/${order.order_code}`}>
                                        <button onClick={() => {
                                        }} className='flex text-sm lg:text-lg text-gray-text items-center border border-gray-text py-1 px-3 rounded-full'>
                                            เคลมสินค้า
                                        </button>
                                    </Link>
                                    <Link href={`/profile/complain_order/${order.order_code}`}>
                                        <button onClick={() => {
                                        }} className='flex text-sm lg:text-lg text-gray-text items-center border border-gray-text py-1 px-3 rounded-full'>
                                            ร้องเรียน
                                        </button>
                                    </Link>
                                </div>
                            }
                            {
                                order.order_status == "WP" && <div className="flex gap-x-2">
                                    <button onClick={() => {
                                        payment(order)
                                    }} className='flex text-sm lg:text-lg text-blue-primary items-center border border-blue-primary py-1 px-3 rounded-full'>
                                        <img className="h-4 mr-2" src="/assets/icons/basket.svg" />
                                        ชำระเงิน
                                    </button>
                                    <button onClick={() => {
                                        cancelOrder(item)
                                    }} className='flex text-sm lg:text-lg text-red-500 items-center border border-red-500 py-1 px-3 rounded-full'>
                                        ยกเลิก
                                    </button>
                                </div>
                            }
                        </div> */}
                        <div className='flex my-2'>
                            {
                                getButtonOrder(order)
                            }
                        </div>
                    </div>
                </div>
            </form>
            <Toaster
                reverseOrder={false}
            />
        </div>
        {isModalQrCode && <Modal isModal={isModalQrCode} onClose={() => setisModalQrCode(false)}>
            <div className="flex items-center flex-col">
                <div className="flex items-center flex-col gap-10">
                    {/* <Barcode width={3} value={barCode.shipmentNo} />
                    <Barcode width={3} value={barCode.orgNo} /> */}
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={order.order_code}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>
        </Modal>}
        {isModalTaxInvoice && <Modal isModal={isModalTaxInvoice}
            onConfirm={() => {
                printInvoice();
            }}
            onClose={() => setisModalTaxInvoice(false)}>
            <div className="flex items-center flex-col">
                <div className="gap-10 pt-4">
                    <form onSubmit={submit} className="w-full flex flex-col">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 px-2 ">
                            <div className="w-full relative">
                                <InputComponent
                                    name="tax_tax"
                                    label="เลขประจำตัวผู้เสียภาษี"
                                    placeholder={"เลขประจำตัวผู้เสียภาษี"}
                                    onChange={(e) => setStateTax({ ...stateTax, tax_tax: e.target.value })}
                                    value={stateTax.tax_tax}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="tax_name"
                                    label="ชื่อ-นามสกุล"
                                    placeholder={"ชื่อ-นามสกุล"}
                                    onChange={(e) => setStateTax({ ...stateTax, tax_name: e.target.value })}
                                    value={stateTax.tax_name}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>

                            <div className="w-full relative">
                                <InputComponent
                                    name="tax_tel"
                                    label="เบอร์โทรศัพท์มือถือ"
                                    placeholder={"เบอร์โทรศัพท์มือถือ"}
                                    onChange={(e) => setStateTax({ ...stateTax, tax_tel: e.target.value })}
                                    value={stateTax.tax_tel}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative px-2">
                                <InputComponent
                                    isInput={false}
                                    name="tax_address"
                                    label="ที่อยู่"
                                    placeholder={"ที่อยู่"}
                                    onChange={(e) => setStateTax({ ...stateTax, tax_address: e.target.value })}
                                    value={stateTax.tax_address}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                {/* <SelectComponent
                            label={"จังหวัด"}
                            value={state.province}
                            onChange={(e) => {
                                setState({ ...state, province: e?.value ?? "", district: "", subdistrict: "", zipcode: "" })
                            }}
                            options={provinces} /> */}
                                <SelectComponent
                                    label={"รหัสไปรษณีย์"}
                                    onChange={(e) => {
                                        let codeSplit = e?.value?.split("_");
                                        if (codeSplit?.length > 0) {
                                            setStateTax({
                                                ...stateTax, sender_code: e?.value,
                                                tax_zipcode: codeSplit[0],
                                                tax_subdistrict: codeSplit[1],
                                                tax_district: codeSplit[2],
                                                tax_province: codeSplit[3]
                                            });
                                        } else {
                                            setStateTax({
                                                ...stateTax, sender_code: e?.value,
                                                tax_zipcode: "",
                                                tax_subdistrict: "",
                                                tax_district: "",
                                                tax_province: ""
                                            });
                                        }
                                    }}
                                    value={stateTax.sender_code ?? ""}
                                    options={thAddress} />
                            </div>
                            <div className="w-full relative">
                                {/* <SelectComponent
                            disabled={!state.province}
                            label={"อำเภอ"}
                            value={state.district}
                            onChange={(e) => setState({ ...state, district: e?.value ?? "", subdistrict: "", zipcode: "" })}
                            options={state.province ? district.filter(x => x.province == state.province) : district} /> */}
                                <InputComponent
                                    disabled
                                    name="tax_subdistrict"
                                    label={"ตำบล"}
                                    placeholder={"ตำบล"}
                                    value={stateTax?.tax_subdistrict}
                                    errors={fieldErrors}
                                />
                            </div>
                            <div className="w-full relative">
                                {/* <SelectComponent
                            disabled={!state.district}
                            label={"ตำบล"}
                            value={state.subdistrict}
                            onChange={(e) => setState({ ...state, subdistrict: e?.value ?? "", zipcode: e?.zipcode ?? "" })}
                            options={subdistrict.filter(x => x.district == state.district)} /> */}
                                <InputComponent
                                    disabled
                                    name="tax_district"
                                    label={"อำเภอ"}
                                    placeholder={"อำเภอ"}
                                    value={stateTax?.tax_district}
                                    errors={fieldErrors}
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    disabled
                                    name="tax_province"
                                    label={"จังหวัด"}
                                    placeholder={"จังหวัด"}
                                    value={stateTax?.tax_province}
                                    errors={fieldErrors}
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </Modal>
        }

    </div>
}

import { promises as fs } from 'fs';
import path from 'path';
import ApiUsers from "api/ApiUsers";
import { useDispatch } from "react-redux";
export async function getServerSideProps(params) {
    const id = params.query.id;
    const result = await ApiOrders.findOrder(params.query.id);
    const jsonDirectory = path.join(process.cwd(), 'json');
    const addressJson = await fs.readFile(jsonDirectory + '/th-address.json', 'utf8');
    const configContent = await ApiMasters.getConfigMaster();
    //  const resultClaim = await ApiMasters.getClaim();
    return {
        props: {
            id: id,
            order: result.data,
            addresses: JSON.parse(addressJson),
            configContent: configContent.data,
            // claims: resultClaim.data,
        },
    }
}

export default OrderDetailPage;