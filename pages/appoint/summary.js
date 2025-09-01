import InputComponent from '@components/Input';
import { Disclosure, RadioGroup } from '@headlessui/react';
import { BellIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { CheckIcon, UsersIcon } from '@heroicons/react/solid';
import ApiMasters from 'api/ApiMasters';
import ApiOrders from 'api/ApiOrders';
import _, { sumBy } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { CheckPriceBox, ConvertDateShortThai, CurrencyThai, ValidateInput } from 'utils';
const zipcode_island = [
    "94000", "94110", "94120", "94130", "94140", "94150", "94160", "94170", "94180", "94190", "94220", "94230",
    "95000", "95110", "95120", "95130", "95140", "95150", "95160", "95170",
    "96000", "96110", "96120", "96130", "96140", "96150", "96160", "96170", "96180", "96190", "96210", "96220",
    "58000", "58110", "58120", "58130", "58140", "58150", "20120", "23170", "84140", "84280", "84360"
];
const zipcode_island_condition = [
    {
        zipcode: "23120",
        recv_subdistrict: ["เกาะหมาก"],
    },
    {
        zipcode: "81150",
        recv_subdistrict: ["เกาะลันตาน้อย", "เกาะลันตาใหญ่", "ศาลาด่าน"],
    },
    {
        zipcode: "81120",
        recv_subdistrict: ["เกาะกลาง", "คลองยาง"],
    },
    {
        zipcode: "82160",
        recv_subdistrict: ["เกาะยาวน้อย", "เกาะยาวใหญ่"],
    },
    {
        zipcode: "83000",
        recv_subdistrict: ["พรุใน"],
    },
    {
        zipcode: "84310",
        recv_subdistrict: ["มะเร็ต"],
    },
    {
        zipcode: "84320",
        recv_subdistrict: ["บ่อผุด"],
    },
    {
        zipcode: "84330",
        recv_subdistrict: ["แม่น้ำ"],
    }
];
const data = [
    {
        type: "frozen",
        name: "สินค้าแช่แข็ง",
        size: "M",
        price: 220,
        qty: 3,
    },
    {
        type: "chilled",
        name: "สินค้าแช่เย็น",
        size: "M",
        price: 170,
        qty: 2,
    }
];

const paymentMethod = [
    {
        value: 1,
        name: "1",
        label: "เครดิต"
    },
    {
        value: 2,
        name: "2",
        label: "เงินสด"
    },
]

const Summary = ({ promotions, config = [], insuranceMaster = [] }) => {
    const [selected, setSelected] = useState(paymentMethod[1])
    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [priceAll, setpriceAll] = useState(0);
    const [estimateValueAll, setestimateValueAll] = useState(0);
    const [qtyAll, setQtyAll] = useState(0);
    const [discount, setdiscount] = useState(0);
    const [isInsurance, setisInsurance] = useState(true);
    const [insurancePrice, setinsurancePrice] = useState(0);
    const [insurancePercent, setinsurancePercent] = useState(0);
    const [promotion_code, setpromotion_code] = useState([]);
    const [voucherItem, setVoucherItem] = useState({});
    const [voucherPrice, setvoucherPrice] = useState(0);
    const [itemsRender, setitemsRender] = useState([]);
    const [state, setState] = useState({
        sender_name: "",
        sender_tel: "",
        sender_tel2: "",
        sender_address: "",
        sender_province: "",
        sender_district: "",
        sender_subdistrict: "",
        sender_zipcode: "",
        recv_name: "",
        recv_tel: "",
        recv_tel2: "",
        recv_address: "",
        recv_province: "",
        recv_district: "",
        recv_subdistrict: "",
        recv_zipcode: "",
        book_date: new Date(),
        book_period: "",
        order_remark: "",
        promotion_code: "",
        voucher_code: "",
        discount_amt: 0,
        insurance_amt: 0,
        is_dropoff: false,
        receive_list: [],
        items: [
        ],
        zone_origin: 0,
        zone_destination: 0,

    });
    const appointData = useSelector(state => state.appointData);
    const userState = useSelector(state => state.user);
    const [priceDelivery, setpriceDelivery] = useState(0);
    const changeAddress = () => {
        router.push('editAddress');
    }

    const [checkSelected, setcheckSelected] = useState([]);

    const [fieldErrors, setFieldErrors] = useState({

    });



    useEffect(() => {
        //setSelected(paymentMethod.find(x => x.value == userState.paymentmethod));
        if (appointData?.sender_name) {
            setState(appointData);
            if (userState.paymentmethod == 1) {
                if (_.sumBy(appointData.items, item => Number(item.amount)) < 5) {
                    // setpriceDelivery(userState.pickup_charge ?? 0)
                }
            } else {
                if (_.sumBy(appointData.items, item => Number(item.amount)) < 5) {
                    const configPrice = config.find(x => x.config_code == "price_delivery")
                    if (userState.pickup_charge == null) {
                        setpriceDelivery(parseFloat(configPrice.config_value ?? 0))
                    }
                    else if (userState.pickup_charge >= 0) {
                        setpriceDelivery(userState.pickup_charge)
                    }
                    else {
                        setpriceDelivery(parseFloat(configPrice.config_value ?? 0))
                    }
                }

            }
        } else {
            router.push('/appoint');
        }
    }, []);

    useEffect(() => {
        if (state.items.length > 0) {
            calculatePromotions();
        }

    }, [state]);

    const onSubmit = async (e) => {

        e.preventDefault();
        var isValid = handleValidation();
        if (isValid) {
            setloading(true);
            try {
                const randomDelay = Math.floor(Math.random() * 2000) + 1;
                setTimeout(async () => {
                    const result = await ApiOrders.createOrders({
                        ...state,
                        book_date: moment(state.book_date).add(7, 'hours'),
                        items: itemsRender,
                        promotion_code: promotion_code.join(','),
                        discount_amt: discount + voucherPrice,
                        insurance_amt: sumBy(itemsRender, item => Number(item.is_insurance ? item.insurance_price : 0)),
                        island_price: sumBy(itemsRender, item => Number(item.island_price)),
                        box_amt: _.sumBy(state.items, item => Number(item.amount)),
                        price_amt: _.sumBy(state.items, item => Number(CheckPriceBox(item.priceObject, item) * parseInt(item.amount))),
                        delivery_amt: parseFloat(priceDelivery),
                        wallet: userState.wallet ?? ""
                    });

                    const { data, status } = result;
                    if (status == 200) {
                        dispatch({ type: "set", appointData: {} });
                        toast.success('สร้างใบงานสำเร็จ!', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                            duration: 2000
                        });

                        if (data?.data) {
                            setloading(false);
                            window.open(data.data.redirectUrl, "_self");
                        } else {
                            const successTimeout = setTimeout(() => {
                                setloading(false);
                                router.push('/profile'), 500
                            })
                            return () => clearTimeout(successTimeout)
                        }
                    } else {
                        setloading(false);
                    }
                }, randomDelay);
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
        } else {
            setloading(false)
        }

    }

    const handleValidation = () => {
        let filesArray = ["cod", "wallet"];
        let fields = state;
        let errors = {};
        let formIsValid = true;

        filesArray.map((item, index) => {
            // console.log('fields[item]', fields[item])
            itemsRender.map((subitem, subindex) => {
                var keyfield = `${item}_${subitem.key}`;
                if (subitem.is_cod) {
                    if (item == "wallet") {
                        if (!userState.wallet) {
                            formIsValid = false;
                            errors[keyfield] = "กรุณากรอกข้อมูล (สามารถแก้ไขได้ที่หน้าโปรไฟล์)";
                        }
                    } else {
                        if (!subitem[item]) {
                            formIsValid = false;
                            errors[keyfield] = "กรุณากรอกข้อมูล";
                        }
                    }
                }
                if (item == "wallet" && subitem[item]) {
                    errors[keyfield] = ValidateInput(subitem[item], "mobile");
                    if (errors[keyfield]) {
                        formIsValid = false;
                    }
                }
            }
            );
        })
        if (formIsValid == false) {
            const input = document.querySelector(
                `input[name=${Object.keys(errors)[0]}]`
            );
            const div = document.querySelector(
                `div[name=${Object.keys(errors)[0]}]`
            );
            const textarea = document.querySelector(
                `textarea[name=${Object.keys(errors)[0]}]`
            );
            const select = document.querySelector(
                `select[name=${Object.keys(errors)[0]}]`
            );

            if (input) {
                input.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
            if (div) {
                div.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
            if (textarea) {
                textarea.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
            if (select) {
                select.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'start',
                });
            }
        }

        setFieldErrors(errors);
        return formIsValid;
    }

    const calculatePromotions = async () => {
        let discountPrice = 0;
        let promotion_code = [];
        let price = _.sumBy(state.items, item => Number(CheckPriceBox(item.priceObject, item) * parseInt(item.amount)));
        let qty = _.sumBy(state.items, item => Number(item.amount));
        //let estimateValue = _.sumBy(state.items, item => Number(item.estimateValue));
        const proAll = promotions.find(x => x.pro_code == "PRO_001");
        const proZone = promotions.find(x => x.pro_code == "PRO_002");
        const proDepart = promotions.find(x => x.pro_code == "PRO_003");
        const proSeason = promotions.find(x => x.pro_code == "PRO_004");
        const proVoucher = promotions.find(x => x.pro_code == "PRO_005");
        const proCustomer = promotions.find(x => x.pro_code == "PRO_006");
        if (proAll && moment(proAll.pro_startdate) <= moment() && moment(proAll.pro_enddate) >= moment()) {
            if (proAll.is_percent) {
                discountPrice += price * proAll.pro_amt_percent / 100;
                promotion_code.push(proAll.pro_code);
            } else {
                discountPrice += parseFloat(proAll.pro_amt);
            }

        }
        else if (!proAll && proSeason && moment(proSeason.pro_startdate) <= moment() && moment(proSeason.pro_enddate) >= moment()) {
            //console.log(proSeason)
            discountPrice += price * proSeason.pro_amt / 100;
            promotion_code.push(proSeason.pro_code);
        }

        if (proZone) {
            const zone_destination = state.zone_destination;
            const discount = proZone.zone.find(x => x.id == zone_destination);
            if (discount && discount?.pro_amt > 0) {
                discountPrice += price * discount.pro_amt / 100;
                promotion_code.push(proZone.pro_code);
            }
            // console.log(zone_destination)
            //    if(proZone)
        }

        if (proCustomer && userState.pro_amt > 0) {
            discountPrice += price * userState.pro_amt / 100;
            promotion_code.push(proCustomer.pro_code);
        }
        // if (estimateValue) {
        //     const configInsurance = await ApiMasters.getInsurancePrice(estimateValue);
        //     if (configInsurance.status == 200) {
        //         const { data } = configInsurance;

        //         //setinsurancePercent(configInsurance);
        //         setinsurancePrice(parseInt(data?.price) ?? 0);
        //     }
        // }

        //let configInsurance = config.find(x => x.config_code == "insurance")?.config_value ?? 0;

        //setestimateValueAll(estimateValue);
        setQtyAll(qty);
        setpriceAll(price);
        setpromotion_code(promotion_code)
        setdiscount(discountPrice)
        if (itemsRender.length == 0) {
            let newItems = [];
            _.orderBy(state.items, 'id', 'asc').map((item, index) => {
                if (parseFloat(item.price_amt) > 0) {
                    const recv = state.receive_list.find(x => x.recv_id == item.recv_id);
                    if (zipcode_island.includes(recv.recv_zipcode)) {
                        item.island_price = 100.00;
                    } else {
                        if (zipcode_island_condition.find(x => x.zipcode == recv.recv_zipcode)) {
                            const is_land = zipcode_island_condition.find(x => x.zipcode == recv.recv_zipcode);
                            if (is_land.recv_subdistrict.includes(recv.recv_subdistrict)) {
                                item.island_price = 100.00;
                            } else {
                                item.island_price = 0;
                            }
                        } else {
                            item.island_price = 0;
                        }
                    }

                    for (var i = 0; i < parseInt(item.amount); i++) {
                        newItems.push({
                            ...item,
                            estimate_value: 0,
                            amount: 1,
                            key: `item_key_${index}_${i}`,
                            is_insurance: false,
                            insurance_price: 0,
                            island_price: item.island_price ?? 0
                        });
                    }
                }
            })
            setitemsRender(newItems);
        }
    }

    // useEffect(() => {
    //     if (itemsRender.length > 0 && insuranceMaster.length > 0) {
    //         itemsRender.map((item, index) => {
    //             const insurance = insuranceMaster.find(x => x.minthb <= item.estimateValue && x.maxthb >= item.estimateValue);
    //             if (insurance) {
    //                 item.insurancePrice = insurance.price;
    //             }
    //         })
    //         setitemsRender(itemsRender);
    //     }
    // }, [itemsRender]);


    const renderPromotions = () => {
        let components = [];
        let price = _.sumBy(state.items, item => Number(CheckPriceBox(item.priceObject, item) * parseInt(item.amount)));
        const proAll = promotions.find(x => x.pro_code == "PRO_001");
        const proZone = promotions.find(x => x.pro_code == "PRO_002");
        const proDepart = promotions.find(x => x.pro_code == "PRO_003");
        const proSeason = promotions.find(x => x.pro_code == "PRO_004");
        const proVoucher = promotions.find(x => x.pro_code == "PRO_005");
        const proCustomer = promotions.find(x => x.pro_code == "PRO_006");
        if (proAll && moment(proAll.pro_startdate) <= moment() && moment(proAll.pro_enddate) >= moment()) {
            components.push(
                <div className='flex justify-between'>
                    <div className='flex-1'>
                        {
                            proAll.is_percent ?
                                <span className='font-bold'>{proAll.pro_desc} {`(${proAll.pro_amt_percent}%) :`}</span> :
                                <span className='font-bold'>{proAll.pro_desc} {`(${proAll.pro_amt} บาท) :`}</span>
                        }

                    </div>
                    <div className='whitespace-nowrap'>

                        {
                            proAll.is_percent ?
                                <h4 className='font-bold'>{`${CurrencyThai(price * proAll.pro_amt_percent / 100)} บาท`}</h4> :
                                <h4 className='font-bold'>{`${CurrencyThai(proAll.pro_amt)} บาท`}</h4>
                        }
                    </div>
                </div>
            )
        }
        if (proCustomer && userState.pro_amt > 0) {
            components.push(
                <div className='flex justify-between'>
                    <div className='flex-1'>
                        <span className='font-bold'>{proCustomer.pro_desc} {`(${userState.pro_amt}%) :`}</span>
                    </div>
                    <div className='whitespace-nowrap'>
                        <h4 className='font-bold'>{`${CurrencyThai(price * userState.pro_amt / 100)} บาท`}</h4>
                    </div>
                </div>
            )
        }
        if (proZone) {
            const zone_destination = state.zone_destination;
            const discount = proZone.zone.find(x => x.id == zone_destination);
            if (discount && discount?.pro_amt > 0) {
                components.push(
                    <div className='flex justify-between'>
                        <div className='flex-1'>
                            <span className='font-bold'>{`${proZone.pro_desc} (${discount.zone_name})`} {`(${discount?.pro_amt}%) :`}</span>
                        </div>
                        <div className='whitespace-nowrap'>
                            <h4 className='font-bold'>{`${CurrencyThai(price * discount.pro_amt / 100)} บาท`}</h4>
                        </div>
                    </div>
                )
            }

            // console.log(zone_destination)
            //    if(proZone)
        }
        return <>{components}</>
    }

    const getVoucher = async () => {
        setVoucherItem({});
        setvoucherPrice(0)
        try {
            const result = await ApiMasters.getVoucher(state.voucher_code);
            if (result.status == 200) {
                const { data } = result;
                setVoucherItem(data);
                if (data.amount_percent > 0) {
                    setvoucherPrice(priceAll * data.amount_percent / 100);
                } else {
                    setvoucherPrice(data.amount);
                }
                // setvoucherPrice()
            }
        }
        catch (error) {
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

    return (
        <>
            {!state.sender_name ? <></> :
                <div>
                    <Toaster
                        reverseOrder={false}
                    />
                    <div className="w-full bg-blue-sky p-5 px-5 sm:px-10">
                        <div className='flex items-center'>
                            <BellIcon
                                className="w-14 h-14 mr-5 text-blue-primary"
                                aria-hidden="true"
                            />
                            <label className="text-blue-primary text-sm sm:text-base">เพื่อให้สินค้าถึงมือผู้รับให้เร็วที่สุด กรุณาตรวจสอบที่อยู่ของผู้ส่งและ
                                ผู้รับอีกครั้ง เพื่อหลีกเลี่ยงการนำจ่ายไม่สำเร็จ</label>
                        </div>

                    </div>
                    <form onSubmit={onSubmit}>
                        <div className='container mx-auto px-4 mt-7 sm:mt-10 max-w-5xl'>
                            {/* <div className='border rounded-lg p-3 lg:p-5'>
            <div className='flex justify-between'>
                <label className="text-blue-primary font-semibold">ที่อยู่ที่ผู้ส่งสินค้า</label>
                <div className='flex items-center gap-2'>
                    <img className="h-4" src="/assets/icons/pencil.svg" />
                    <label onClick={() => changeAddress()} className="text-blue-primary underline cursor-pointer italic">เปลี่ยนที่อยู่</label>
                </div>
            </div>
            <div className='flex py-3 gap-3 lg:gap-5'>
                <img className="h-10" src="/assets/images/location.webp" />
                <div className='flex flex-col lg:gap-5'>
                    <div className='flex gap-3 lg:gap-5'>
                        <label className="text-sm font-semibold">นายยืนยง คงกระพัน</label>
                        <label className="text-gray-text text-sm font-semibold">Tel : 0812345678</label>
                    </div>
                    <label className="text-sm">9/317 หมู่ที่ ุ ซอยบางใหญ่ซิตี๋ ตำบลเสาธงหิน อำเภอบางใหญ่ จังหวัดนนทบุรี 11140</label>
                    <button className='border border-red-default rounded-md w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>
                </div>
            </div>
        </div> */}
                            <div className='border rounded-lg p-3 lg:p-5'>
                                <div className='flex justify-between'>
                                    <label className="text-blue-primary font-semibold">ที่อยู่ที่ผู้ส่งสินค้า</label>
                                    <Link href={"/appoint"}>
                                        <div onClick={() => { }} className='flex items-center gap-2 cursor-pointer'>
                                            <img className="h-4" src="/assets/icons/pencil.svg" />
                                            <label className="text-blue-primary underline cursor-pointer">เปลี่ยนที่อยู่</label>
                                        </div>
                                    </Link>
                                </div>
                                <div className='flex py-3 gap-3 lg:gap-5'>
                                    <img className="h-10" src="/assets/images/location.webp" />
                                    <div className='flex flex-col lg:gap-3'>
                                        <div className='flex gap-3 lg:gap-5'>
                                            <label className="text-sm font-semibold">{state.sender_name}</label>
                                            <label className="text-gray-text text-sm font-semibold">Tel : {state.sender_tel}</label>
                                        </div>
                                        <label className="text-sm">{`${state.sender_address} ${state.sender_subdistrict} ${state.sender_district} ${state.sender_province} ${state.sender_zipcode}`}</label>
                                    </div>
                                </div>
                            </div>
                            {
                                state.receive_list.map((recv, recvIndex) => {
                                    return <Disclosure key={recv.recv_id} defaultOpen>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full  !bg-white border items-center mt-5 justify-between rounded-t-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                                    <div className='flex justify-between items-center p-2'>
                                                        <div className='flex gap-3 items-center'>
                                                            {/* <img className="h-7 lg:h-9" src="/assets/icons/box-check.svg" /> */}
                                                            <label className="text-blue-primary font-semibold">{recvIndex + 1}. ผู้รับสินค้า {recv.recv_name ? `(${recv.recv_name ?? ""})` : ""}</label>
                                                        </div>
                                                    </div>
                                                    <ChevronUpIcon
                                                        className={`${open ? 'rotate-180 transform' : ''
                                                            } h-5 w-5 text-purple-500`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 border rounded-b-lg pb-4 pt-4 text-sm text-gray-500 flex gap-y-6 flex-col">
                                                    <div className=''>
                                                        <div className='flex py-3 gap-3 lg:gap-5'>
                                                            <img className="h-10" src="/assets/images/location.webp" />
                                                            <div className='flex flex-col lg:gap-3'>
                                                                <div className='flex gap-3 lg:gap-5'>
                                                                    <label className="text-sm font-semibold">{recv.recv_name}</label>
                                                                    <label className="text-gray-text text-sm font-semibold">Tel : {recv.recv_tel}</label>
                                                                </div>
                                                                <label className="text-sm">{`${recv.recv_address} ${recv.recv_subdistrict} ${recv.recv_district} ${recv.recv_province} ${recv.recv_zipcode}`}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex-col flex gap-y-5'>
                                                        {itemsRender.filter(x =>
                                                            x.recv_id == recv.recv_id
                                                        ).map((item, index) => {
                                                            return <div key={item.key}
                                                                className='flex items-center'>
                                                                {/* <img className="h-14 sm:h-14" src="/assets/images/trackingTitle.webp" /> */}
                                                                <img className="h-10 lg:h-14" src="/assets/images/order-1.webp" />
                                                                <div className='flex flex-col ml-5 font-bold flex-1'>
                                                                    <div>
                                                                        <label>{item.type_name} {`(${item.service_name})`}</label>
                                                                    </div>
                                                                    <div className='flex justify-between w-full'>
                                                                        <label>Size {item.size_name} {CheckPriceBox(item.priceObject, item) ?? 0} บาท</label>
                                                                        <div className='flex gap-x-1 items-center'>
                                                                            <label>จำนวน :</label>
                                                                            <label>{item.amount}</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex justify-between w-full flex-wrap gap-y-3'>
                                                                        <div className='flex flex-col'>
                                                                            <div className='flex gap-x-4 flex-wrap gap-y-3'>
                                                                                <div className='flex flex-col flex-wrap gap-y-3'>

                                                                                    <div className="form-check mx-2 sm:mx-0 items-center flex">
                                                                                        <input id={`${item.key}`}
                                                                                            disabled={!(item.type_name == "Cool Box")}
                                                                                            onChange={(e) => {
                                                                                                let checked = [...itemsRender];
                                                                                                console.log('itemsRender::', itemsRender)
                                                                                                if (e.target.checked) {
                                                                                                    const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                    if (itemIndex > -1) {
                                                                                                        checked[itemIndex].is_insurance = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                    if (itemIndex > -1) {
                                                                                                        checked[itemIndex].is_insurance = false;
                                                                                                    }
                                                                                                }
                                                                                                setitemsRender(checked);
                                                                                            }}
                                                                                            type="checkbox"
                                                                                            value=""
                                                                                            className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                                                        <label className="form-check-label inline-block text-gray-800 text-sm font-bold" htmlFor={`${item.key}`}>
                                                                                            ประกันความเสียหายและสินค้าสูญหาย
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className='flex-1 relative mt-2'>
                                                                                        <InputComponent
                                                                                            name={`estimate_value_${item.key}`}
                                                                                            label="มูลค่าสินค้า"
                                                                                            placeholder="มูลค่าสินค้า"
                                                                                            type="number"
                                                                                            onFocus={item.estimate_value == 0 ?
                                                                                                () => {
                                                                                                    let checked = [...itemsRender];
                                                                                                    const index = checked.findIndex(x => x.key == item.key);
                                                                                                    checked[index].estimate_value = "";
                                                                                                    setState({ ...state, items: checked });
                                                                                                } : () => { }}
                                                                                            onChange={(e) => {
                                                                                                let checked = [...itemsRender];
                                                                                                const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                checked[itemIndex].estimate_value = e.target?.value ?? "";
                                                                                                if (insuranceMaster.length > 0) {
                                                                                                    const insurance = insuranceMaster.find(x => parseFloat(x.minthb) <= e.target?.value && parseFloat(x.maxthb) >= e.target?.value);
                                                                                                    if (insurance) {
                                                                                                        checked[itemIndex].insurance_price = insurance.price;
                                                                                                    } else {
                                                                                                        if (e.target?.value > 0) {
                                                                                                            checked[itemIndex].insurance_price = insuranceMaster[insuranceMaster.length - 1].price;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                const index = checked.findIndex(x => x.key == item.key);
                                                                                                if (checked[index].estimate_value > 2000 && !(checked[index].is_insurance) && item.type_id == 1) {
                                                                                                    toast.error(
                                                                                                        `สินค้ามีมูลค่ามากกว่า 2,000 บาท แนะนำให้ทำรับประกันเพิ่มเติม`,
                                                                                                        {
                                                                                                            duration: 3000,
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                                //checked[index].estimate_value = CurrencyThai(checked[index].estimate_value);
                                                                                                setState({ ...state, items: checked });
                                                                                                setitemsRender(checked);
                                                                                            }}
                                                                                            value={item.estimate_value ?? 0}
                                                                                            errors={fieldErrors}

                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className='flex flex-1 flex-col flex-wrap gap-y-3'>
                                                                                    <div className="form-check mx-2 sm:mx-0 items-center flex">
                                                                                        <input id={`cod_${item.key}`}
                                                                                            onChange={(e) => {
                                                                                                let checked = [...itemsRender];
                                                                                                if (e.target.checked) {
                                                                                                    const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                    if (itemIndex > -1) {
                                                                                                        checked[itemIndex].is_cod = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                    if (itemIndex > -1) {
                                                                                                        checked[itemIndex].is_cod = false;
                                                                                                    }
                                                                                                }
                                                                                                setitemsRender(checked);
                                                                                            }}
                                                                                            type="checkbox"
                                                                                            value=""
                                                                                            className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                                                        <label className="form-check-label inline-block text-gray-800 text-sm font-bold"
                                                                                            htmlFor={`cod_${item.key}`}
                                                                                        >
                                                                                            เก็บเงินปลายทาง
                                                                                        </label>
                                                                                    </div>
                                                                                    {
                                                                                        item.is_cod && <div className='flex gap-x-2'>
                                                                                            <div className='flex-1 relative mt-2'>
                                                                                                <InputComponent
                                                                                                    name={`cod_${item.key}`}
                                                                                                    label="เก็บเงินปลายทาง"
                                                                                                    type="text"
                                                                                                    placeholder="เก็บเงินปลายทาง"
                                                                                                    onFocus={item.cod == 0 ?
                                                                                                        () => {
                                                                                                            let checked = [...itemsRender];
                                                                                                            const index = checked.findIndex(x => x.key == item.key);
                                                                                                            checked[index].cod = "";
                                                                                                            setState({ ...state, items: checked });
                                                                                                        } : () => { }}
                                                                                                    onChange={(e) => {
                                                                                                        let checked = [...itemsRender];
                                                                                                        const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                        checked[itemIndex].cod = e.target?.value ?? "";
                                                                                                        const index = checked.findIndex(x => x.key == item.key);
                                                                                                        if (checked[index].cod > 49000) {
                                                                                                            toast.error(
                                                                                                                `สินค้ามีมูลค่ามากกว่า 49000 บาท ไม่สามารถระบุได้`,
                                                                                                                {
                                                                                                                    duration: 3000,
                                                                                                                }
                                                                                                            );
                                                                                                            checked[itemIndex].cod = "";
                                                                                                        }
                                                                                                        //checked[index].estimate_value = CurrencyThai(checked[index].estimate_value);
                                                                                                        setState({ ...state, items: checked });
                                                                                                        setitemsRender(checked);
                                                                                                    }}
                                                                                                    value={item.cod ?? 0}
                                                                                                    errors={fieldErrors}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                            <div className='flex-1 relative mt-2'>
                                                                                                <InputComponent
                                                                                                    name={`wallet_${item.key}`}
                                                                                                    label="Wallet ID"
                                                                                                    type="tel"
                                                                                                    placeholder="Wallet ID"
                                                                                                    onFocus={item.wallet ?
                                                                                                        () => {
                                                                                                            let checked = [...itemsRender];
                                                                                                            const index = checked.findIndex(x => x.key == item.key);
                                                                                                            checked[index].wallet = "";
                                                                                                            setState({ ...state, items: checked });
                                                                                                        } : () => { }}
                                                                                                    onChange={(e) => {
                                                                                                        let checked = [...itemsRender];
                                                                                                        const itemIndex = checked.findIndex(x => x.key == item.key)
                                                                                                        checked[itemIndex].wallet = e.target?.value ?? "";
                                                                                                        const index = checked.findIndex(x => x.key == item.key);
                                                                                                        //checked[index].estimate_value = CurrencyThai(checked[index].estimate_value);
                                                                                                        setState({ ...state, items: checked });
                                                                                                        setitemsRender(checked);
                                                                                                    }}
                                                                                                    disabled={true}
                                                                                                    value={userState.wallet ?? ""}
                                                                                                    errors={fieldErrors}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    }

                                                                                </div>


                                                                            </div>


                                                                        </div>
                                                                        {item.is_insurance &&
                                                                            <div className='bg-blue-CA h-fit rounded-lg p-2 w-fit flex gap-x-2 items-center'>
                                                                                <h1 className='text-lg text-blue-primary'>{CurrencyThai(item.insurance_price)}</h1>
                                                                                <span>บาท / ชิ้น</span>
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                })
                            }
                            {/* <div className='border rounded-lg p-3 lg:p-5 mt-5'>
                                <div className='flex justify-between'>
                                    <label className="text-blue-primary font-semibold">ผู้รับสินค้า</label>
                                    <Link href={"/appoint"}>
                                        <div className='flex items-center gap-2'>
                                            <img className="h-4" src="/assets/icons/pencil.svg" />
                                            <label className="text-blue-primary underline cursor-pointer italic">แก้ไขผู้รับ</label>
                                        </div>
                                    </Link>
                                </div>
                                <div className='flex py-3 gap-3 lg:gap-5'>
                                    <img className="h-10" src="/assets/images/location.webp" />
                                    <div className='flex flex-col lg:gap-3'>
                                        <div className='flex gap-3 lg:gap-5'>
                                            <label className="text-sm font-semibold">{state.recv_name}</label>
                                            <label className="text-gray-text text-sm font-semibold">Tel : {state.recv_tel}</label>
                                        </div>
                                        <label className="text-sm">{`${state.recv_address} ${state.recv_subdistrict} ${state.recv_district} ${state.recv_province} ${state.recv_zipcode}`}</label>
                                    </div>
                                </div>
                            </div> */}
                            <div className='border rounded-lg lg:p-5 mt-5'>
                                <div className='px-3 flex justify-end items-center'>
                                    <label className="text-blue-primary font-semibold">รวมทั้งสิ้น {`(${_.sumBy(state.items, item => Number(item.amount))} กล่อง) :`}</label>
                                    <h5 className='ml-1 text-xl'>{`${CurrencyThai(_.sumBy(state.items, item => Number(CheckPriceBox(item.priceObject, item) * parseInt(item.amount))))} บาท`}</h5>
                                </div>
                            </div>
                            <div className='border rounded-lg p-3 lg:p-5 mt-5'>
                                <div className='flex justify-between'>
                                    <div className='flex items-center'>
                                        <img className="w-8 h-8 mr-2" src="/assets/icons/shipping-fast-blue.svg" />
                                        <label className="text-black-text font-semibold">{`เข้ารับสินค้าวันที่ ${ConvertDateShortThai(state.book_date, "DD MMM YY")}  ${state.book_period_name} น.`}</label>
                                    </div>
                                    <Link href={"/appoint"}>
                                        <div className='flex items-center gap-2'>
                                            <img className="h-4" src="/assets/icons/pencil.svg" />
                                            <label className="text-blue-primary underline cursor-pointer italic">แก้ไข</label>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className='mt-5 flex flex-col gap-y-2'>
                                {/* <h4 className='text-blue-primary'>ซื้อความคุ้มครองเพิ่มเติม</h4> */}
                                <div className='flex gap-x-4 flex-wrap gap-y-3'>
                                    {/* <div onClick={() => {
                        setisInsurance(!isInsurance);
                    }} className={`sm:flex-1 items-center cursor-pointer flex gap-x-3 sm:gap-x-5 border rounded-lg p-3 lg:p-5 ${isInsurance && "border-blue-secondary border-[2px]"}`}>
                        <div>
                            <img className="block h-10 w-20 sm:w-auto" src={'/assets/icons/truck-fast-thin.png'} alt="Logo" />
                        </div>
                        <div className='flex gap-y-2 flex-col'>
                            <span>ประกันความเสียหาย และสินค้าสูญหายระหว่างการขนส่ง</span>
                            <div className='bg-blue-CA rounded-lg sm:p-2 px-4 w-fit flex gap-x-2 items-center'>
                                <h1 className='text-2xl text-blue-primary'>{CurrencyThai(insurancePrice)}</h1>
                                <span>บาท / เที่ยว</span>
                            </div>
                        </div>
                    </div> */}
                                    <div className={`sm:flex-1 cursor-pointer flex gap-x-3 sm:gap-x-5 bg-[#efefef] rounded-lg p-3 lg:p-5`}>
                                        <div className='flex gap-y-2 flex-col flex-1'>
                                            <span>โค้ดส่วนลดของ Fuze</span>
                                            <div className='flex gap-x-2'>
                                                <div className='flex-1'>
                                                    <InputComponent
                                                        name="voucher_code"
                                                        label="กรอกโค้ดส่วนลดของ Fuze"
                                                        placeholder={"กรอกโค้ดส่วนลดของ Fuze"}
                                                        onChange={(e) => setState({ ...state, voucher_code: e.target.value })}
                                                        value={state.voucher_code}
                                                    />
                                                </div>
                                                <button type="button" disabled={!state.voucher_code} onClick={() => {
                                                    getVoucher();
                                                }} className='bg-[#b5b5b8] text-white p-2 px-4 rounded'>ตกลง</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5 sm:whitespace-nowrap flex flex-col bg-blue-CA py-5 px-10 rounded-lg'>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='font-bold'>รวมสินค้า</span>
                                        <span>&nbsp;{`(${qtyAll} กล่อง)`}</span>
                                    </div>
                                    <div>
                                        <h4 className='font-bold'>{`${CurrencyThai(priceAll)} บาท`}</h4>
                                    </div>
                                </div>
                                {
                                    renderPromotions()
                                }
                                {
                                    voucherPrice > 0 && <div className='flex justify-between'>
                                        <div>
                                            <span className='font-bold'>โค้ดส่วนลด ({voucherItem.code})</span>
                                        </div>
                                        <div>
                                            <h4 className='font-bold'>{`${CurrencyThai(voucherPrice)} บาท`}</h4>
                                        </div>
                                    </div>
                                }
                                {
                                    isInsurance && <div className='flex justify-between'>
                                        <div>
                                            <span className='font-bold'>ค่าบริการรับประกัน</span>
                                        </div>
                                        <div>
                                            <h4 className='font-bold'>{`${CurrencyThai(sumBy(itemsRender, item => Number(item.is_insurance ? item.insurance_price : 0)))} บาท`}</h4>
                                        </div>
                                    </div>
                                }
                                {
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='font-bold'>ค่าพื้นที่ห่างไกล</span>
                                        </div>
                                        <div>
                                            <h4 className='font-bold'>{`${CurrencyThai(sumBy(itemsRender, item => Number(item.island_price)))} บาท`}</h4>
                                        </div>
                                    </div>
                                }
                                {
                                    priceDelivery > 0 && <div className='flex justify-between'>
                                        <div>
                                            <span className='font-bold'>ค่าขนส่งขั้นต่ำ 5 กล่อง</span>
                                        </div>
                                        <div>
                                            <h4 className='font-bold'>{`${CurrencyThai(priceDelivery)} บาท`}</h4>
                                        </div>
                                    </div>
                                }

                            </div>
                            <div className='px-3 pb-3 flex justify-end items-center mt-2'>
                                <label className="text-blue-primary">ยอดรวมทั้งสิ้น :</label>
                                <h5 className='ml-1 text-2xl text-blue-primary'>{`${CurrencyThai(priceAll - discount - voucherPrice + parseFloat(priceDelivery) + sumBy(itemsRender, item => Number(item.is_insurance ? item.insurance_price : 0)) + sumBy(itemsRender, item => Number(item.island_price)))} บาท`}</h5>
                            </div>
                            <div className='flex gap-x-4'>
                                <Link href="/appoint">
                                    <button type="button" className="w-full px-16 py-3 bg-blue-primary bg-gray-400 rounded-md text-white mt-5">
                                        ย้อนกลับ
                                    </button>
                                </Link>
                                <button disabled={loading} type="submit" className="w-full px-16 py-3 bg-blue-primary rounded-md text-white mt-5">
                                    ชำระเงิน
                                </button>
                            </div>
                        </div>
                    </form>
                </div>}
        </>

    )
}

export async function getServerSideProps({ params }) {
    const result = await ApiMasters.getPromotions();
    const result2 = await ApiMasters.getInsuranceMaster();
    const config = await ApiMasters.getConfigMaster();
    return {
        props: {
            promotions: result.data,
            insuranceMaster: result2.data,
            config: config.data,
        }
    }
}

export default Summary;