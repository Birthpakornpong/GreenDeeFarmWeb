import React, { useEffect, useState } from 'react';
import TitleMenu from 'components/TitlePage'
import InputComponent from 'components/Input'
import SelectComponent from 'components/Select'
import { useRouter } from 'next/router';
import ApiMasters from 'api/ApiMasters';
import _ from 'lodash';
import ApiUsers from 'api/ApiUsers';
import { Disclosure, RadioGroup, Switch } from '@headlessui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@components/Modal';
import { TrashIcon, DocumentIcon } from '@heroicons/react/solid';
import ModalAddress from '@components/CustomModal/ModalAddress';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import Swal from 'sweetalert2'

const typeBusiness = [
    {
        value: false,
        name: "self",
        label: "รับของตามที่อยู่จัดส่ง"
    },
    // {
    //     value: true,
    //     name: "dropoff",
    //     label: "จัดส่งที่สาขา"
    // },
]

const Appoint = ({ addresses = [], boxes, configContent = [], productType = [], dropoff_master = [], typeSize = [], serviceType = [], priceTemplateMaster = [], addressMaster = [], addressExcept = [] }) => {
    const [profile, setprofile] = useState({
        addresses: [],
        defaultSender: "",
        defaultReceive: ""
    });
    const [thAddress, setThAddress] = useState([]);
    const [thAddressReceive, setThAddressReceive] = useState([]);
    const [thAddressSender, setthAddressSender] = useState([]);
    const appointData = useSelector(state => state.appointData);
    const isCustomerCenter = useSelector(state => state.isCustomerCenter);
    const [addressExceptsWater, setaddressExceptsWater] = useState([
    ]);
    const dispatch = useDispatch();
    const [timePeriod, settimePeriod] = useState([
        {
            value: "1",
            label: "ทุกช่วงเวลา"
        },
        {
            value: "2",
            label: "09:00-12:00"
        },
        {
            value: "3",
            label: "13:00-17:00"
        }
    ]);
    const [recvIdSelected, setrecvIdSelected] = useState(0);
    const userState = useSelector(state => state.user);
    const [provinces, setprovinces] = useState([]);
    const [district, setDistrict] = useState([]);
    const [subdistrict, setSubDistrict] = useState([]);
    const [boxTypes, setBoxTypes] = useState([]);
    const [boxSizes, setBoxSizes] = useState([]);
    const [boxServices, setBoxServices] = useState([]);
    const [isCheck, setisCheck] = useState(false);
    const [selected, setSelected] = useState(typeBusiness[0])
    const [priceTemplate, setpriceTemplate] = useState([]);
    const [state, setState] = useState({
        sender_id: 0,
        sender_name: "",
        sender_tel: "",
        sender_tel2: "",
        sender_address: "",
        sender_province: "",
        sender_district: "",
        sender_subdistrict: "",
        sender_zipcode: "",
        recv_id: 0,
        recv_name: "",
        recv_tel: "",
        recv_tel2: "",
        recv_address: "",
        recv_province: "",
        recv_district: "",
        recv_subdistrict: "",
        recv_zipcode: "",
        book_date: moment().format('HH') >= 12 ? moment().add(userState.paymentmethod == 1 ? 0 : 1, 'day').toDate() : moment().toDate(),
        book_period: "",
        book_period_name: "",
        order_remark: "",
        promotion_code: "",
        voucher_code: "",
        discount_amt: 0,
        insurance_amt: 0,
        is_dropoff: typeBusiness[0].value,
        dropoff_code: "",
        receive_list: [],
        items: [],
        zone_origin: 0,
        zone_destination: 0,
        box_test: false,
    });
    const [isModal, setIsModal] = useState(false);
    const [isModalImage, setIsModalImage] = useState(false);
    const [senderModal, setSenderModal] = useState(false);
    const [receiveModal, setReceiveModal] = useState(false);
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState({

    });

    useEffect(() => {
        let thAddressList = [];
        let thAddressListSender = [];
        let thAddressListReceive = [];
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
        const zone_id = _(addressMaster)
            .groupBy(o => o.zipcode)
            .map((items, key) => ({ value: key, label: key, zone_id: items[0].zone_id }))
            .value();

        addresses.filter(x => zone_id.filter(x => x.zone_id == 7).map(x => x.value).includes(x.zipCode)).map((item, index) => {
            item.subDistrictList.map((subitem, subIndex) => {
                let district = item.districtList.find(x => x.districtId == subitem.districtId);
                let province = item.provinceList.find(x => x.provinceId == subitem.provinceId);
                thAddressListSender.push({
                    value: `${item.zipCode}_${subitem.subDistrictName}_${district.districtName}_${province.provinceName}`,
                    label: `${item.zipCode}, ${subitem.subDistrictName}, ${district.districtName}, ${province.provinceName}`
                })
            })
        });


        addresses.map((item, index) => {
            item.subDistrictList.map((subitem, subIndex) => {
                let district = item.districtList.find(x => x.districtId == subitem.districtId);
                let province = item.provinceList.find(x => x.provinceId == subitem.provinceId);
                if (!(addressExceptsWater.includes(item?.zipCode))) {
                    thAddressListReceive.push({
                        value: `${item.zipCode}_${subitem.subDistrictName}_${district.districtName}_${province.provinceName}`,
                        label: `${item.zipCode}, ${subitem.subDistrictName}, ${district.districtName}, ${province.provinceName}`
                    })
                }
            })
        });
        setThAddressReceive(thAddressListReceive.filter(x => !addressExcept.map(y => y.value).includes(x.value)));
        // console.log("addressMaster::", addressMaster)
        setThAddress(thAddressList);
        setthAddressSender(thAddressListSender)
        // setthAddressSender(thAddressList.filter(x=>x.));
    }, []);

    const appointConfirm = (e) => {
        e.preventDefault();
        var isValid = handleValidation();
        if (isValid) {
            if (userState.paymentmethod == 1 || userState.is_allow_sender) {

            } else {
                const address = thAddressSender.find(x => x.value == state.sender_code);
                if (!address) {
                    toast.error(`เปิดรับสินค้าเฉพาะพื้นที่ กรุงเทพและปริมณฑล เท่านั้น`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        className: "text-lg"
                    })
                    return false;
                }
            }

            const receives = state.receive_list;

            // if (!isCustomerCenter) {
            //     // const prefixes = ["10", "11", "12"];
            //     // if (prefixes.some(prefix => state.sender_zipcode.startsWith(prefix))) {
            //     //     var isServiceValid = false;
            //     //     receives.map((y) => {
            //     //         if (prefixes.some(prefix => y.recv_zipcode.startsWith(prefix))) {
            //     //         } else {
            //     //             isServiceValid = true;
            //     //         }
            //     //     })
            //     //     if (isServiceValid) {
            //     //         toast.error(`เปิดให้บริการเฉพาะ กรุงเทพ และ ปริมณฑล`, {
            //     //             style: {
            //     //                 borderRadius: '10px',
            //     //                 background: '#333',
            //     //                 color: '#fff',
            //     //             },
            //     //             className: "text-lg"
            //     //         })
            //     //         return false;
            //     //     }
            //     // } else {
            //     //     toast.error(`เปิดให้บริการเฉพาะ กรุงเทพ และ ปริมณฑล`, {
            //     //         style: {
            //     //             borderRadius: '10px',
            //     //             background: '#333',
            //     //             color: '#fff',
            //     //         },
            //     //         className: "text-lg"
            //     //     });
            //     //     return false;
            //     // }
            //     toast.error(`ปิดระบบการให้บริการ 12-16 เม.ย. 68 เนื่องในเทศกาลสงกรานต์ `, {
            //         style: {
            //             borderRadius: '10px',
            //             background: '#333',
            //             color: '#fff',
            //         },
            //         className: "text-lg"
            //     });
            //     return false;
            // }

            //
            const items = state.items;


            if (items.length == 0) {
                toast.error(`กรุณาระบุข้อมูลสินค้าอย่างน้อย 1 รายการ`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
                return false;
            }
            isValid = false;
            items.map((item, index) => {
                if (!item.service_id || !item.size_id || !item.type_id || !item.product_type_id || !(item.amount > 0)) isValid = true;
            })

            receives.map((item, index) => {
                const itemReceive = items.find(x => x.recv_id == item.recv_id);
                if (!itemReceive) {
                    isValid = true;
                    toast.error(`มีผู้รับสินค้าที่ไม่ได้ระบุกล่อง กรุณาระบุอย่างน้อย 1 รายการ`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        className: "text-lg"
                    })
                    return false;
                }
            })
            receives.map((y) => {
                if (addressExceptsWater.find(x => x == `${y.recv_zipcode}`)) {
                    isValid = true;
                    toast.error(`พื้นที่ ${y.recv_zipcode} ประสบอุทกภัย ไม่สามารถจัดส่งสินค้าได้`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        className: "text-lg"
                    })
                }
            })
            if (isValid == true) {
                let errors = {};
                errors["items"] = "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน";
                setFieldErrors(errors);
                const span = document.querySelector(
                    `span[name=items_validate]`
                );
                if (span) {
                    span.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'start',
                    });
                }

            } else {
                let priceList = [];
                priceList = priceTemplate.filter(x => x.customer_code?.includes(userState?.customer_code))
                if (priceList.length == 0 || !(userState?.customer_code) || userState?.customer_code == "") {
                    priceList = priceTemplate.filter(x => x.template_name == 'Standard Template')
                }


                let zone_origin = provinces.find(x => x.value == state.sender_province?.trim())?.zone_id ?? 0;
                //let zone_origin = provinces.find(x => x.value == state.sender_province)?.zone_id ?? 0;
                let zone_destination = 0;
                state.zone_origin = zone_origin;
                state.zone_destination = zone_destination;
                items.map((item, index) => {
                    const recv = state.receive_list.find(x => x.recv_id == item.recv_id);

                    zone_destination = provinces.find(x => x.value == recv.recv_province?.trim())?.zone_id ?? 0;

                    if (zone_destination == 0) {
                        let thAddressItem = thAddress.find(x => x.value.includes(recv.recv_zipcode));
                        if (thAddressItem) {
                            let codeSplit = thAddressItem?.value?.split("_");
                            zone_destination = provinces.find(x => x.value == codeSplit[3]?.trim())?.zone_id ?? 0;
                        }
                    }

                    if (item.type_name == "Cool Box") {
                        if (state.sender_province == recv.recv_province) {
                            // zone_origin = provinces.find(x => x.value == "กรุงเทพมหานคร")?.zone_id ?? 0;
                            // zone_destination = provinces.find(x => x.value == "กรุงเทพมหานคร")?.zone_id ?? 0;
                            item.priceObject = priceList.find(x => x.is_same_province);
                        }
                        else {
                            item.priceObject = priceList.find(x => x.zone_destination == zone_destination && x.zone_origin == zone_origin);
                        }
                    }
                    else if (item.type_name == "Foam Box" || item.type_name == "Carton Box") {
                        if (state.sender_province == recv.recv_province) {
                            // zone_origin = provinces.find(x => x.value == "กรุงเทพมหานคร")?.zone_id ?? 0;
                            // zone_destination = provinces.find(x => x.value == "กรุงเทพมหานคร")?.zone_id ?? 0;
                            item.priceObject = priceList.find(x => x.is_same_province);
                        } else {
                            item.priceObject = priceList.find(x => x.zone_destination == zone_destination && x.zone_origin == zone_origin);
                        }
                    }
                    else if (item.type_name == "Test Box") {
                        item.price_amt = 200;
                        item.total_amt = 200;
                        item.priceObject = "";
                    }
                    if (item.priceObject) {
                        var amount = CheckPriceBox(item.priceObject, item);
                        item.price_amt = amount;
                        item.total_amt = amount;
                    }
                })
                let errors = {};
                if (moment().format('HH') >= 12 && moment(state.book_date).date() == moment().date() && userState.paymentmethod == 2) {
                    errors["book_date"] = "จองหลัง 12:00 กรุณาระบุเป็นวันพรุ่งนี้";
                    const input = document.querySelector(
                        `input[name=${Object.keys(errors)[0]}]`
                    );

                    if (input) {
                        input.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'start',
                        });
                    }
                    setFieldErrors(errors)
                } else {
                    if (appointData.sender_id) {
                        appointConfirmModal();
                    } else {
                        setIsModal(true);
                        setFieldErrors({});
                    }
                }


            }
        }
    }

    const appointConfirmModal = (e) => {
        dispatch({ type: "set", appointData: { ...state, is_dropoff: selected.value } });
        router.push('appoint/summary')
    }



    const handleValidation = () => {
        let filesArray = ["sender_name", "sender_tel",
            "sender_address", "sender_province", "sender_district",
            "sender_subdistrict", "sender_zipcode",
            // "recv_name", "recv_tel", "recv_address",
            // "recv_province", "recv_district", "recv_subdistrict",
            // "recv_zipcode", 
            "book_date"];
        let filesArrayReceive = ["recv_name", "recv_tel",
            "recv_address", "recv_province", "recv_district",
            "recv_subdistrict", "recv_zipcode", "recv_code",
            // "recv_name", "recv_tel", "recv_address",
            // "recv_province", "recv_district", "recv_subdistrict",
            // "recv_zipcode", 
        ];
        let fields = state;
        let errors = {};
        let formIsValid = true;

        filesArray.map((item, index) => {
            if (!fields[item]) {
                formIsValid = false;
                errors[item] = "กรุณากรอกข้อมูล";
            }
        })
        filesArrayReceive.map((item, index) => {
            state.receive_list.map((subitem, subindex) => {
                var keyfield = `${item}_${subitem.recv_id}`;
                if (!subitem[item]) {
                    formIsValid = false;
                    errors[keyfield] = "กรุณากรอกข้อมูล";
                }
            })
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



    useEffect(() => {
        getProfile();
        const province = _(addressMaster)
            .groupBy(o => o.province)
            .map((items, key) => ({ value: key, label: key, zone_id: items[0].zone_id }))
            .value();
        const amphoe = _(addressMaster)
            .groupBy(o => o.amphoe)
            .map((items, key) => ({ value: key, label: key, province: items[0].province }))
            .value();
        const district = _(addressMaster)
            .groupBy(o => o.district)
            .map((items, key) => ({ value: key, label: key, district: items[0].amphoe, provice: items[0].provice, zipcode: items[0].zipcode }))
            .value();
        setprovinces(province);
        setDistrict(amphoe);
        setSubDistrict(district)
        const boxesMaster = _(typeSize)
            .groupBy(o => o.type_id)
            .map((items, key) => ({ value: key, label: items[0].type_name, items: items }))
            .value();
        const boxSizesMaster = _(typeSize)
            .groupBy(o => o.size_id)
            .map((items, key) => ({ value: key, label: items[0].size_name, type_id: items[0].type_id, weight: items[0].weight }))
            .value();
        const boxServicesMaster = _(serviceType)
            //.groupBy(o => `${o.type_id}_${o.service_id}`)
            .map((items, key) => ({ value: items.service_id, label: items.service_name }))
            .value();
        setBoxTypes(boxesMaster);
        setBoxSizes(boxSizesMaster);
        setBoxServices(boxServicesMaster);
        setpriceTemplate(priceTemplateMaster);
    }, []);


    const getProfile = async () => {
        const result = await ApiUsers.getUserProfile();
        if (result.status == 200) {
            dispatch({ type: "set", user: result.data.userData });
            let sender = result.data.userData.addresses.find(x => x.type == "S" && x.is_default == true);
            if (!sender) {
                sender = result.data.userData.addresses.find(x => x.type == "S");
            }
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
            if (appointData?.sender_name) {
                result.data.userData.defaultSender = result.data.userData.addresses.find(x => x.id == appointData.sender_id);;
                result.data.userData.defaultReceive = result.data.userData.addresses.find(x => x.id == appointData.recv_id);;
                setprofile(result.data.userData);
                setState({ ...appointData, book_date: new Date(appointData.book_date) });
            } else {
                setState(newState);
                setprofile(result.data.userData);
            }

        }
    }

    const uploadFile = async (file) => {
        // const formData = new FormData();
        // formData.append('files', file)
        try {
            // ฟิลด์ที่ต้องการตรวจสอบ
            const requiredFields = ["TRACKING_REF", "PROVIDER_REF"]; // ใส่ชื่อฟิลด์ที่ต้องการ
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];

                /* Convert array to json*/
                const payload = XLSX.utils.sheet_to_json(ws, {
                    range: 0,
                    raw: false,
                });

                const payload2 = XLSX.utils.sheet_to_json(ws, {
                    range: 0,
                    raw: false,
                    header: 1 // ดึงเฉพาะ header row
                });

                // header row (สมมติว่า header อยู่แถวแรก)
                const headers = payload2[0];

                console.log(headers);

                if (!headers) {
                    toast.error(`Sheet is empty or headers are missing.`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        className: "text-lg"
                    })
                    return false;
                }

                // ตรวจสอบว่าทุกฟิลด์ใน requiredFields มีอยู่ใน headers หรือไม่
                const missingFields = requiredFields.filter(field => !headers.includes(field));

                if (missingFields.length > 0) {
                    toast.error(`Missing fields: ${missingFields} กรุณาโหลดรูปแบบไฟล์เวอร์ชั่นใหม่`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        className: "text-lg"
                    })
                    return false;
                }

                if (payload.length >= 1) {

                    let orderUploaded = {
                        sender_id: state.sender_id,
                        sender_code: `${payload[0].SENDER_ZIPCODE?.trim()}_${payload[0].SENDER_SUBDISTRICT?.trim()}_${payload[0].SENDER_DISTRICT?.trim()}_${payload[0].SENDER_PROVINCE?.trim()}`,
                        sender_name: payload[0].SENDER_NAME ?? "",
                        sender_tel: payload[0].SENDER_TEL ?? "",
                        sender_tel2: payload[0].SENDER_TEL2 ?? "",
                        sender_address: payload[0].SENDER_ADDRESS ?? "",
                        sender_province: payload[0].SENDER_PROVINCE ?? "",
                        sender_district: payload[0].SENDER_DISTRICT ?? "",
                        sender_subdistrict: payload[0].SENDER_SUBDISTRICT ?? "",
                        sender_zipcode: payload[0].SENDER_ZIPCODE ?? "",
                        recv_id: 0,
                        recv_name: "",
                        recv_tel: "",
                        recv_tel2: "",
                        recv_address: "",
                        recv_province: "",
                        recv_district: "",
                        recv_subdistrict: "",
                        recv_zipcode: "",
                        book_date: moment().format('HH') >= 12 ? moment().add(userState.paymentmethod == 1 ? 0 : 1, 'day').toDate() : moment().toDate(),
                        book_period: "",
                        book_period_name: "",
                        order_remark: "",
                        promotion_code: "",
                        voucher_code: "",
                        discount_amt: 0,
                        insurance_amt: 0,
                        is_dropoff: typeBusiness[0].value,
                        dropoff_code: "",
                        receive_list: [],
                        items: [],
                        zone_origin: 0,
                        zone_destination: 0,
                    };


                    const receiveGroup = _.chain(payload).groupBy((item) => `${item.RECV_NAME}${"_"}${item.RECV_ADDRESS}${"_"}${item.RECV_SUBDISTRICT}${"_"}${item.RECV_DISTRICT}${"_"}${item.RECV_PROVINCE}${"_"}${item.RECV_ZIPCODE}`).value();
                    const receiveGroupKeys = Object.keys(receiveGroup);
                    var errorMessage = "";
                    receiveGroupKeys.map((receive, receiveIndex) => {
                        const modelReceive = {
                            // recv_code: `${receiveGroup[receive][0].RECV_ZIPCODE?.trim()}_${receiveGroup[receive][0].RECV_SUBDISTRICT?.trim()}_${receiveGroup[receive][0].RECV_DISTRICT?.trim()}_${receiveGroup[receive][0].RECV_PROVINCE?.trim()}`,
                            recv_name: receiveGroup[receive][0].RECV_NAME?.trim(),
                            recv_address: receiveGroup[receive][0].RECV_ADDRESS?.trim(),
                            recv_subdistrict: receiveGroup[receive][0].RECV_SUBDISTRICT.replace("ตำบล", "").replace("ต.", "").replace("แขวง", "").trim(),
                            recv_district: receiveGroup[receive][0].RECV_DISTRICT.replace("อำเภอ", "").replace("อ.", "").replace("เขต", "").trim(),
                            recv_province: receiveGroup[receive][0].RECV_PROVINCE.replace("จังหวัด", "").replace("จ.", "").replace("กทม", "กรุงเทพมหานคร").replace("กรุงเทพฯ", "กรุงเทพมหานคร").trim(),
                            recv_zipcode: receiveGroup[receive][0].RECV_ZIPCODE?.trim(),
                            recv_tel: receiveGroup[receive][0].RECV_TEL,
                            recv_tel2: receiveGroup[receive][0].RECV_TEL2,
                            recv_id: +new Date() + receiveIndex,
                            items: [],
                        }

                        modelReceive.recv_code = `${modelReceive.recv_zipcode}_${modelReceive.recv_subdistrict}_${modelReceive.recv_district}_${modelReceive.recv_province}`;

                        if (!(thAddress.find(x => x.value == modelReceive.recv_code))) {
                            if (!errorMessage) {
                                errorMessage += `ข้อมูลรหัสไปรษณีย์ไม่ถูกต้อง ผู้รับ ${modelReceive.recv_name}`;
                            } else {
                                errorMessage += `,${modelReceive.recv_name}`;
                            }
                            modelReceive.recv_code = "";
                        }
                        orderUploaded.receive_list.push(modelReceive);
                        receiveGroup[receive].map((itemOrder, itemOrderIndex) => {
                            const typeBox = boxTypes.find(x => x.label == itemOrder.SERVICE_NAME?.trim());
                            const serviceBox = boxServices.find(x => x.label == itemOrder?.SEND_NAME.trim());
                            const sizeBox = boxSizes.find(x => x.label == itemOrder?.SIZE_NAME.trim() && x.type_id == typeBox?.value);
                            const productTypeBox = productType.find(x => x.product_type_name.includes(itemOrder.ITEMS_NAME?.trim()))
                            orderUploaded.items.push({
                                id: +new Date() + "_" + receiveIndex + "_" + itemOrderIndex,
                                key: `item_key_${receiveIndex}_${itemOrderIndex}`,
                                type_id: typeBox?.value,
                                type_name: typeBox?.label,
                                service_id: serviceBox?.value,
                                service_name: serviceBox?.label,
                                size_id: sizeBox?.value,
                                size_name: sizeBox?.label,
                                product_type_id: productTypeBox?.id,
                                product_type_name: productTypeBox?.product_type_name,
                                product_default_name: productTypeBox?.product_type_name,
                                amount: itemOrder.AMOUNT > 0 ? itemOrder.AMOUNT : 1,
                                price: 0,
                                is_insurance: false,
                                estimate_value: "",
                                weight: "",
                                insurance_price: 0,
                                remark: "",
                                recv_province: modelReceive.recv_province,
                                recv_district: modelReceive.recv_district,
                                recv_subdistrict: modelReceive.recv_subdistrict,
                                recv_zipcode: modelReceive.recv_zipcode,
                                recv_id: modelReceive.recv_id,
                                remark: itemOrder.ORDER_REMARK ?? "",
                                tracking_ref: itemOrder.PROVIDER_REF ?? "",
                                provider_ref: itemOrder.TRACKING_REF ?? "",
                                job_type: itemOrder.JOB_TYPE ?? "WEB"
                            })
                        })
                    })
                    if (errorMessage) {
                        toast.error(`${errorMessage} กรุณาตรวจสอบไฟล์ `, {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                            className: "text-lg"
                        })
                    }
                    //console.log(orderUploaded)
                    setState(orderUploaded);
                }

                //setFileUploaded(dataParse);
            };
            reader.readAsBinaryString(file)
            // const result = await ApiOrders.uploadOrder(formData);
            // if (result.status == 200) {
            //     const { data } = result;
            //     console.log(data)
            //     let main = {}
            //     if (data.length > 0) {
            //         const mainData = data[0];
            //         let message = "";
            //         main = {
            //             sender_id: 0,
            //             sender_name: mainData.SENDER_NAME,
            //             sender_tel: mainData.SENDER_TEL,
            //             sender_address: mainData.SENDER_ADDRESS,
            //             sender_province: mainData.SENDER_PROVINCE?.trim(),
            //             sender_district: mainData.SENDER_DISTRICT?.trim(),
            //             sender_subdistrict: mainData.SENDER_SUBDISTRICT?.trim(),
            //             sender_zipcode: mainData.SENDER_ZIPCODE?.trim(),
            //             recv_id: 0,
            //             recv_name: mainData.RECV_NAME,
            //             recv_tel: mainData.RECV_TEL,
            //             recv_address: mainData.RECV_ADDRESS,
            //             recv_province: mainData.RECV_PROVINCE?.trim(),
            //             recv_district: mainData.RECV_DISTRICT?.trim(),
            //             recv_subdistrict: mainData.RECV_SUBDISTRICT?.trim(),
            //             recv_zipcode: mainData.RECV_ZIPCODE?.trim(),
            //             book_date: new Date(mainData.BOOKDATE),
            //             book_period: "",
            //             book_period_name: "",
            //             order_remark: mainData.ORDER_REMARK ?? "",
            //             promotion_code: "",
            //             voucher_code: "",
            //             discount_amt: 0,
            //             insurance_amt: 0,
            //             items: []
            //         }
            //         data.map((item, index) => {
            //             let boxInfoItem = boxes.find(x => x.size_name == item.SIZE_NAME && x.service_name == item.SEND_NAME);
            //             if (!boxInfoItem) {
            //                 message += `Row ${index + 1} ไม่พบข้อมูลกล่อง\n`;
            //             } else {
            //                 console.log(boxInfoItem)
            //                 main.items.push({
            //                     type_id: boxInfoItem.type_id,
            //                     type_name: boxInfoItem.type_name,
            //                     service_id: boxInfoItem.service_id,
            //                     service_name: boxInfoItem.service_name,
            //                     size_id: boxInfoItem.size_id,
            //                     size_name: boxInfoItem.size_name,
            //                     product_type_id: "",
            //                     product_type_name: item.ITEMS_NAME,
            //                     product_default_name: item.ITEMS_NAME,
            //                     amount: item.AMOUNT,
            //                     price: 0,
            //                     estimateValue: ""
            //                 })
            //             }
            //         })
            //         if (message) {
            //             toast.error(message, {
            //                 style: {
            //                     borderRadius: '10px',
            //                     background: '#333',
            //                     color: '#fff',
            //                 },
            //                 className: "text-lg"
            //             })
            //         } else {
            //             setState(main);
            //         }
            //     }

            // }
        } catch (error) {
            console.log(error);
            toast.dismiss();
            // const { data } = error.response;
            toast.error("Template ในการนำเข้าข้อมูลผิดพลาด", {
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
        <div>
               <TitleMenu imageSrc="/assets/images/carTitle.webp" title="นัดหมายรับสินค้า" description='กรุณากรอกรายละเอียดให้ครบถ้วนบริษัทฯจะส่ง SMS ยืนยันการเข้ารับตามหมายเลขโทรศัพย์ที่แจ้งไว้' />
         
            <Toaster
                reverseOrder={false}
            />
            <div className='hidden md:flex px-5 lg:px-24 pt-7 items-center'>
                <label className="text-blue-primary">เพื่อความสะดวกท่านสามารถนัดหมายรับสินค้าได้ด้วยการแนบไฟล์เอกสาร (Excel)</label>
                <label htmlFor={`image_excel`} className='cursor-pointer flex border border-blue-primary rounded text-blue-primary px-5 py-2 ml-5'>
                    <img className="h-6 mr-3" src="/assets/icons/file.svg" />
                    แบบไฟล์ (Excel)
                    <input id={`image_excel`} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" type="file" name="files"
                        // multiple 
                        // accept="image/png, image/jpeg"
                        className="hidden" onChange={(e) => {
                            if (e.target.files[0]) {
                                let message = CheckFile({
                                    file: e.target.files[0],
                                    size: 2,
                                    type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
                                    message: "รองรับเฉพาะไฟล์ .xlsx เท่านั้น",
                                });
                                if (message) {
                                    toast.error(message, {
                                        style: {
                                            borderRadius: '10px',
                                            background: '#333',
                                            color: '#fff',
                                        },
                                        className: "text-lg"
                                    })
                                } else {
                                    uploadFile(e.target.files[0]);
                                }
                            } else {
                            }
                            e.target.value = null;

                        }} />
                </label>
                {/* <Link  href={"/assets/FUZE_Upload_SCG_EXPRESS.xlsx"} > */}
                <a href='/assets/FUZE_Upload_Example.xlsx' download className='cursor-pointer flex border border-blue-primary rounded text-blue-primary px-5 py-2 ml-5'>
                    <img className="h-6 mr-3" src="/assets/icons/file.svg" />
                    ดาวน์โหลด (Excel)
                </a>
                {/* </Link> */}
            </div>
            <form onSubmit={appointConfirm}>
                <div className='px-5 lg:px-24 py-7'>
                    <div className='flex justify-between'>
                        <div className='flex gap-3 mb-5 items-center'>
                            <img className="h-7 lg:h-10" src="/assets/icons/box-heart.svg" />
                            <label className="text-blue-primary lg:text-xl font-semibold">ผู้ส่งสินค้า</label>
                        </div>
                        <div className='flex items-center gap-x-4 justify-end'>
                            <div className='flex items-center gap-x-2'>
                                <img className="h-4" src="/assets/icons/pencil.svg" />
                                <label onClick={() => {
                                    setSenderModal(true);
                                }} className="text-blue-primary underline cursor-pointer">เปลี่ยนที่อยู่</label>
                            </div>
                        </div>

                    </div>


                    {
                        // (profile.addresses.filter(x => x.type == "S" && x.is_default == true).length == 0 || state.sender_id == 0) &&
                        <form className="w-full flex flex-col gap-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 px-2 ">
                                <div className="w-full relative">
                                    <InputComponent
                                        name="sender_tel"
                                        disabled={profile.addresses.filter(x => x.type == "S")?.length > 0}
                                        label="เบอร์โทรศัพท์ผู้ส่งสินค้า"
                                        placeholder={"เบอร์โทรศัพท์ผู้ส่งสินค้า"}
                                        onChange={(e) => setState({ ...state, sender_tel: e.target.value })}
                                        value={state.sender_tel}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        name="sender_tel2"
                                        label="เบอร์โทรศัพท์ผู้ส่งสินค้า ​(สำรอง)"
                                        placeholder={"เบอร์โทรศัพท์ผู้ส่งสินค้า ​(สำรอง)"}
                                        onChange={(e) => setState({ ...state, sender_tel2: e.target.value })}
                                        value={state.sender_tel2}
                                    />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        name="sender_name"
                                        disabled={profile.addresses.filter(x => x.type == "S")?.length > 0}
                                        label="ชื่อ - นามสกุล ผู้ส่งสินค้า"
                                        placeholder={"ชื่อ - นามสกุล ผู้ส่งสินค้า"}
                                        onChange={(e) => setState({ ...state, sender_name: e.target.value })}
                                        value={state.sender_name}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>

                            </div>
                            <div className="w-full relative px-2">
                                <InputComponent
                                    isInput={false}
                                    name="sender_address"
                                    rows={2}
                                    disabled={profile.addresses.filter(x => x.type == "S")?.length > 0}
                                    label="ที่อยู่"
                                    placeholder={"ที่อยู่"}
                                    onChange={(e) => setState({ ...state, sender_address: e.target.value })}
                                    value={state.sender_address}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            {/* <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1 px-2 ">
                                <div className="w-full relative">
                                    <SelectComponent
                                        name="sender_province"
                                        label={"จังหวัด"}
                                        value={state.sender_province}
                                        onChange={(e) => {
                                            setState({ ...state, sender_province: e?.value ?? "", sender_district: "", sender_subdistrict: "", sender_zipcode: "" })
                                        }}
                                        options={provinces} />
                                </div>
                                <div className="w-full relative">
                                    <SelectComponent
                                        name="sender_district"
                                        disabled={!state.sender_province}
                                        label={"อำเภอ"}
                                        value={state.sender_district}
                                        onChange={(e) => setState({ ...state, sender_district: e?.value ?? "", sender_subdistrict: "", sender_zipcode: "" })}
                                        options={state.sender_province ? district.filter(x => x.province == state.sender_province) : district} />
                                </div>
                                <div className="w-full relative">
                                    <SelectComponent
                                        name="sender_subdistrict"
                                        disabled={!state.sender_district}
                                        label={"ตำบล"}
                                        value={state.sender_subdistrict}
                                        onChange={(e) => setState({ ...state, sender_subdistrict: e?.value ?? "", sender_zipcode: e?.zipcode ?? "" })}
                                        options={subdistrict.filter(x => x.district == state.sender_district)} />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        disabled
                                        name="sender_zipcode"
                                        label="รหัสไปรษณีย์"
                                        placeholder={"รหัสไปรษณีย์"}
                                        onChange={(e) => setState({ ...state, sender_zipcode: e.target.value })}
                                        value={state.sender_zipcode}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>

                            </div> */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1 px-2 ">
                                <div className="w-full relative">
                                    <SelectComponent
                                        disabled={profile.addresses.filter(x => x.type == "S")?.length > 0}
                                        label={"รหัสไปรษณีย์"}

                                        onChange={(e) => {
                                            let codeSplit = e?.value?.split("_");
                                            if (codeSplit?.length > 0) {
                                                setState({
                                                    ...state, sender_code: e?.value,
                                                    sender_zipcode: codeSplit[0],
                                                    sender_subdistrict: codeSplit[1],
                                                    sender_district: codeSplit[2],
                                                    sender_province: codeSplit[3]
                                                });
                                            } else {
                                                setState({
                                                    ...state, sender_code: e?.value,
                                                    sender_zipcode: "",
                                                    sender_subdistrict: "",
                                                    sender_district: "",
                                                    sender_province: ""
                                                });
                                            }
                                        }}
                                        value={state.sender_code ?? ""}
                                        options={(userState.paymentmethod == 1 || userState.is_allow_sender)
                                            ?
                                            thAddress :
                                            thAddressSender
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        disabled
                                        name={"subdistrict"}
                                        label={"ตำบล"}
                                        placeholder={"ตำบล"}
                                        value={state?.sender_subdistrict}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        disabled
                                        name="zipcode"
                                        label={"อำเภอ"}
                                        placeholder={"อำเภอ"}
                                        value={state?.sender_district}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>
                                <div className="w-full relative">
                                    <InputComponent
                                        disabled
                                        name="province"
                                        label={"จังหวัด"}
                                        placeholder={"จังหวัด"}
                                        value={state?.sender_province}
                                        errors={fieldErrors}
                                        required
                                    />
                                </div>

                            </div>
                        </form>
                    }
                    {/* {
                        profile.defaultSender &&
                        <div className='border rounded-lg p-3 lg:p-5'>
                            <div className='flex justify-between'>
                                <label className="text-blue-primary font-semibold">ที่อยู่ผู้ส่งสินค้า</label>
                                <div className='flex items-center gap-x-4'>
                                    <div className='flex items-center gap-x-2'>
                                        <img className="h-4" src="/assets/icons/pencil.svg" />
                                        <label onClick={() => {
                                            setSenderModal(true);

                                        }} className="text-blue-primary underline cursor-pointer">เปลี่ยนที่อยู่</label>
                                    </div>
                                    <div>
                                        <label onClick={() => {
                                            setprofile({ ...profile, defaultSender: "" });
                                            setState({ ...state, sender_id: 0, sender_name: "", sender_address: "", sender_district: "", sender_province: "", sender_subdistrict: "", sender_tel: "", sender_zipcode: "" })
                                        }} className="text-blue-primary underline cursor-pointer">เพิ่มที่อยู่ใหม่</label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex py-3 gap-3 lg:gap-5'>
                                <img className="h-10" src="/assets/images/location.webp" />
                                <div className='flex flex-col lg:gap-3'>
                                    <div className='flex gap-3 lg:gap-5'>
                                        <label className="text-sm font-semibold">{profile.defaultSender.name}</label>
                                        <label className="text-gray-text text-sm font-semibold">Tel : {profile.defaultSender.phone}</label>
                                    </div>
                                    <label className="text-sm">{`${profile.defaultSender.address} ${profile.defaultSender.subdistrict} ${profile.defaultSender.district} ${profile.defaultSender.province} ${profile.defaultSender.zipcode}`}</label>
                                    <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>
                                </div>
                            </div>
                        </div>
                    } */}
                </div>
                <div className='px-5 lg:px-24'>
                    {/* <div className="form-check mx-2 sm:mx-0 items-center flex">
                        <input id={`test_box`}
                            onChange={(e) => {
                                setState({ ...state, box_test: e.target.checked })
                            }}
                            type="checkbox"
                            value=""
                            className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="form-check-label inline-block text-gray-800 text-sm font-bold"
                            htmlFor={`test_box`}
                        >
                            กล่อง Test
                        </label>
                    </div> */}
                    <div className='flex gap-4 w-full'>
                        {
                            <button type="button"
                                onClick={() => {
                                    if (!state.sender_zipcode) {
                                        toast.error("กรุณาระบุที่อยู่ผู้ส่งก่อน", {
                                            style: {
                                                borderRadius: '10px',
                                                background: '#333',
                                                color: '#fff',
                                            },
                                            className: "text-lg"
                                        })
                                    } else {
                                        const items = [...state.receive_list];
                                        items.push({

                                            recv_name: "",
                                            recv_address: "",
                                            recv_subdistrict: "",
                                            recv_district: "",
                                            recv_province: "",
                                            recv_zipcode: "",
                                            recv_tel: "",
                                            recv_tel2: "",
                                            collapsed: true,
                                            recv_id: +new Date()
                                        })
                                        setState({ ...state, receive_list: items });
                                    }
                                }}
                                className='flex bg-blue-primary rounded-lg text-white text-lg p-2 justify-center items-center'>
                                <img className="h-5 mx-2" src="/assets/icons/plus-circle.svg" />
                                เพิ่มข้อมูลผู้รับสินค้า
                            </button>
                        }
                        {
                            // <button type="button"
                            //     onClick={() => {
                            //         Swal.fire({
                            //             title: "ยืนยันการใช้งานกล่อง Test?",
                            //             text: "จะลบข้อมูลผู้รับทั้งหมด และสร้างผู้รับเป็น ฟิ้วซ์ โพสต์",
                            //             icon: "warning",
                            //             showCancelButton: true,
                            //             confirmButtonColor: "#3085d6",
                            //             cancelButtonColor: "#d33",
                            //             cancelButtonText: 'ยกเลิก',
                            //             confirmButtonText: "ยืนยัน"
                            //         }).then((result) => {
                            //             if (result.isConfirmed) {
                            //                 const items = [];
                            //                 items.push({
                            //                     recv_code: `${'10210'}_${'ทุ่งสองห้อง'}_${'หลักสี่'}_${'กรุงเทพมหานคร'}`,
                            //                     recv_name: "บริษัท ฟิ้วซ์ โพสต์ จำกัด",
                            //                     recv_address: "เลขที่ ตึกศูนย์ฝึกอบรม (APPU) ชั้น4 เลขที่ 111",
                            //                     recv_subdistrict: "ทุ่งสองห้อง",
                            //                     recv_district: "หลักสี่",
                            //                     recv_province: "กรุงเทพมหานคร",
                            //                     recv_zipcode: "10210",
                            //                     recv_tel: "02-055-6787",
                            //                     recv_tel2: "",
                            //                     collapsed: true,
                            //                     recv_id: +new Date() + "9999"
                            //                 })
                            //                 setState({ ...state, receive_list: items, items: [] });
                            //             }
                            //         });
                            //     }}
                            //     className='flex bg-red-500 rounded-lg text-white text-lg p-2 pl-4 pr-4 justify-center items-center'>
                            //     {/* <img className="h-5 mx-2" src="/assets/icons/plus-circle.svg" /> */}
                            //     ใช้งานกล่อง Test
                            // </button>
                        }
                    </div>

                    {
                        state.receive_list.map((recv, recvIndex) => {
                            return <Disclosure key={recv.recv_id} defaultOpen>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full  !bg-white border items-center mt-5 justify-between rounded-t-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                            <div className='flex justify-between items-center p-2'>
                                                <div className='flex gap-3 items-center'>
                                                    <img className="h-7 lg:h-9" src="/assets/icons/box-check.svg" />
                                                    <label className="text-blue-primary lg:text-xl font-semibold">{recvIndex + 1}. ผู้รับสินค้า {recv.recv_name ? `(${recv.recv_name ?? ""})` : ""}</label>
                                                </div>
                                            </div>
                                            <div className="flex gap-x-2"

                                            >

                                                <ChevronUpIcon
                                                    className={`${open ? 'rotate-180 transform' : ''
                                                        } h-5 w-5 text-purple-500`}
                                                />
                                                <div
                                                    onClick={() => {
                                                        const newItems = [...state.receive_list];
                                                        const items = state.items.filter(x => x.recv_id != recv.recv_id);
                                                        const index = newItems.findIndex(x => x.recv_id == recv.recv_id);
                                                        newItems.splice(index, 1);
                                                        setState({
                                                            ...state,
                                                            receive_list: newItems,
                                                            items: items
                                                        });
                                                    }}>
                                                    <TrashIcon className='h-8 w-8 text-red-default sm:block hidden' />
                                                </div>

                                            </div>

                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 border rounded-b-lg pb-4 pt-4 text-sm text-gray-500 flex gap-y-6 flex-col">
                                            <div className=''>

                                                {
                                                    <form className="w-full flex flex-col gap-y-4">
                                                        <div className='flex items-center gap-x-4 justify-end'>
                                                            <div className='flex items-center gap-x-2'>
                                                                <img className="h-4" src="/assets/icons/pencil.svg" />
                                                                <label onClick={() => {
                                                                    setReceiveModal(true);
                                                                    setrecvIdSelected(recv.recv_id)
                                                                }} className="text-blue-primary underline cursor-pointer">เปลี่ยนที่อยู่</label>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 px-2 ">
                                                            <div className="w-full relative">
                                                                <InputComponent
                                                                    // name={"recv_tel"}
                                                                    name={`recv_tel_${recv.recv_id}`}
                                                                    label="เบอร์โทรศัพท์ผู้รับสินค้า"
                                                                    placeholder={"เบอร์โทรศัพท์ผู้รับสินค้า"}
                                                                    disabled={recv.recv_id?.toString().includes('9999')}
                                                                    //onChange={(e) => setState({ ...state, recv_tel: e.target.value })}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_tel = e.target.value;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    value={recv.recv_tel}
                                                                    errors={fieldErrors}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="w-full relative">
                                                                <InputComponent

                                                                    name={`recv_tel2_${recv.recv_id}`}
                                                                    label="เบอร์โทรศัพท์ผู้รับสินค้า(สำรอง)"
                                                                    disabled={recv.recv_id?.toString().includes('9999')}
                                                                    placeholder={"เบอร์โทรศัพท์ผู้รับสินค้า(สำรอง)"}
                                                                    // onChange={(e) => setState({ ...state, recv_tel2: e.target.value })}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_tel2 = e.target.value;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    value={recv.recv_tel2}
                                                                //value={state.recv_tel2}
                                                                />
                                                            </div>
                                                            <div className="w-full relative">
                                                                <InputComponent

                                                                    name={`recv_name_${recv.recv_id}`}
                                                                    label="ชื่อ - นามสกุล ผู้รับสินค้า"
                                                                    disabled={recv.recv_id?.toString().includes('9999')}
                                                                    placeholder={"ชื่อ - นามสกุล ผู้รับสินค้า"}
                                                                    // onChange={(e) => setState({ ...state, recv_name: e.target.value })}
                                                                    value={recv.recv_name}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_name = e.target.value;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    errors={fieldErrors}
                                                                    required
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="w-full relative px-2">
                                                            <InputComponent
                                                                isInput={false}
                                                                disabled={recv.recv_id?.toString().includes('9999')}
                                                                name={`recv_address_${recv.recv_id}`}
                                                                rows={2}
                                                                label="ที่อยู่"
                                                                placeholder={"ที่อยู่"}
                                                                value={recv.recv_address}
                                                                onChange={(e) => {
                                                                    const items = [...state.receive_list];
                                                                    items[recvIndex].recv_address = e.target.value;
                                                                    setState({ ...state, receive_list: items });
                                                                }}
                                                                errors={fieldErrors}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1 px-2 ">
                                                            <div className="w-full relative">
                                                                <SelectComponent
                                                                    disabled={recv.recv_id?.toString().includes('9999')}
                                                                    label={"รหัสไปรษณีย์"}
                                                                    name={`recv_code_${recv.recv_id}`}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        let codeSplit = e?.value?.split("_");
                                                                        if (codeSplit?.length > 0) {
                                                                            items[recvIndex].recv_code = e?.value;
                                                                            items[recvIndex].recv_zipcode = codeSplit[0];
                                                                            items[recvIndex].recv_subdistrict = codeSplit[1];
                                                                            items[recvIndex].recv_district = codeSplit[2];
                                                                            items[recvIndex].recv_province = codeSplit[3];
                                                                            setState({ ...state, receive_list: items });
                                                                        } else {
                                                                            items[recvIndex].recv_code = "";
                                                                            items[recvIndex].recv_zipcode = "";
                                                                            items[recvIndex].recv_subdistrict = "";
                                                                            items[recvIndex].recv_district = "";
                                                                            items[recvIndex].recv_province = "";
                                                                            setState({ ...state, receive_list: items });
                                                                        }
                                                                    }}
                                                                    value={recv.recv_code ?? ""}
                                                                    // onSelect={(addresses) => {
                                                                    //     const items = [...state.receive_list];
                                                                    //     console.log("Select", addresses)
                                                                    //     items[recvIndex].recv_district = addresses.district;
                                                                    //     items[recvIndex].recv_province = addresses.province;
                                                                    //     items[recvIndex].recv_subdistrict = addresses.subdistrict;
                                                                    //     items[recvIndex].recv_zipcode = addresses.zipcode;
                                                                    //     setState({ ...state, receive_list: items });
                                                                    // }}
                                                                    options={thAddressReceive} />
                                                            </div>
                                                            <div className="w-full relative">
                                                                <InputComponent
                                                                    disabled
                                                                    name={`recv_subdistrict_${recv.recv_id}`}
                                                                    label={"ตำบล"}
                                                                    placeholder={"ตำบล"}
                                                                    value={recv?.recv_subdistrict}
                                                                    errors={fieldErrors}
                                                                    required
                                                                />
                                                                {/* <SelectComponent
                                                                    disabled={!recv.recv_province}
                                                                    label={"อำเภอ"}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_district = e?.value;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    value={recv?.recv_district}
                                                                    onSelect={(addresses) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_district = addresses.district;
                                                                        items[recvIndex].recv_province = addresses.province;
                                                                        items[recvIndex].recv_subdistrict = addresses.subdistrict;
                                                                        items[recvIndex].recv_zipcode = addresses.zipcode;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    options={recv.recv_province ? district.filter(x => x.province == recv.recv_province) : district} /> */}
                                                            </div>
                                                            <div className="w-full relative">
                                                                <InputComponent
                                                                    disabled
                                                                    // name="zipcode"
                                                                    name={`recv_district_${recv.recv_id}`}
                                                                    label={"อำเภอ"}
                                                                    placeholder={"อำเภอ"}
                                                                    value={recv?.recv_district}
                                                                    errors={fieldErrors}
                                                                    required
                                                                />
                                                                {/* <SelectComponent
                                                                    disabled={!recv.recv_district}
                                                                    label={"ตำบล"}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_subdistrict = e?.value;
                                                                        items[recvIndex].recv_zipcode = e?.zipcode;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    value={recv?.recv_subdistrict}
                                                                    onSelect={(addresses) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_district = addresses.district;
                                                                        items[recvIndex].recv_province = addresses.province;
                                                                        items[recvIndex].recv_subdistrict = addresses.subdistrict;
                                                                        items[recvIndex].recv_zipcode = addresses.zipcode;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    options={subdistrict.filter(x => x.district == recv.recv_district)} /> */}

                                                            </div>
                                                            <div className="w-full relative">
                                                                {/* <InputComponent
                                                                    disabled
                                                                    name="zipcode"
                                                                    label="รหัสไปรษณีย์"
                                                                    placeholder={"รหัสไปรษณีย์"}
                                                                    onChange={(e) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_zipcode = e?.value;
                                                                        setState({ ...state, receive_list: items });
                                                                    }}
                                                                    value={recv?.recv_zipcode}
                                                                    onSelect={(addresses) => {
                                                                        const items = [...state.receive_list];
                                                                        items[recvIndex].recv_district = addresses.district;
                                                                        items[recvIndex].recv_province = addresses.province;
                                                                        items[recvIndex].recv_subdistrict = addresses.subdistrict;
                                                                        items[recvIndex].recv_zipcode = addresses.zipcode;
                                                                        setState({ ...state, receive_list: items });
                                                                        if (zipcode_island.includes(addresses.zipcode)) {
                                                                            CSwl.SwalInfo(`พื้นที่ปลายทางเกาะ มีระยะเวลาการจัดส่ง 1-2วัน`)
                                                                        }
                                                                    }}
                                                                    errors={fieldErrors}
                                                                    required
                                                                /> */}
                                                                <InputComponent
                                                                    disabled
                                                                    name={`recv_province_${recv.recv_id}`}
                                                                    label={"จังหวัด"}
                                                                    placeholder={"จังหวัด"}
                                                                    value={recv?.recv_province}
                                                                    errors={fieldErrors}
                                                                    required
                                                                />
                                                            </div>

                                                        </div>
                                                    </form>
                                                }
                                                {/* {
                                                    profile.defaultReceive &&
                                                    <div className='border rounded-lg p-3 lg:p-5'>
                                                        <div className='flex justify-between'>
                                                            <label className="text-blue-primary font-semibold">ที่อยู่ผู้รับสินค้า</label>
                                                            <div className='flex items-center gap-x-4'>
                                                                <div className='flex items-center gap-x-2'>
                                                                    <img className="h-4" src="/assets/icons/pencil.svg" />
                                                                    <label onClick={() => {
                                                                        setReceiveModal(true);
                                                                    }} className="text-blue-primary underline cursor-pointer">เปลี่ยนที่อยู่</label>
                                                                </div>
                                                                <div>
                                                                    <label onClick={() => {
                                                                        setprofile({ ...profile, defaultReceive: "" });
                                                                        setState({ ...state, recv_id: 0, recv_name: "", recv_address: "", recv_district: "", recv_province: "", recv_subdistrict: "", recv_tel: "", recv_zipcode: "" })
                                                                    }} className="text-blue-primary underline cursor-pointer">เพิ่มที่อยู่ใหม่</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='flex py-3 gap-3 lg:gap-5'>
                                                            <img className="h-10" src="/assets/images/location.webp" />
                                                            <div className='flex flex-col lg:gap-3'>
                                                                <div className='flex gap-3 lg:gap-5'>
                                                                    <label className="text-sm font-semibold">{profile.defaultReceive.name}</label>
                                                                    <label className="text-gray-text text-sm font-semibold">Tel : {profile.defaultReceive.phone}</label>
                                                                </div>
                                                                <label className="text-sm">{`${profile.defaultReceive.address} ${profile.defaultReceive.subdistrict} ${profile.defaultReceive.district} ${profile.defaultReceive.province} ${profile.defaultReceive.zipcode}`}</label>
                                                                <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                } */}
                                            </div>

                                            <div className=''>
                                                <div className='flex gap-5 items-center mb-5'>
                                                    <div className='flex gap-3 items-center'>
                                                        <img className="h-7 lg:h-10" src="/assets/icons/box-alt.svg" />
                                                        <label className="text-blue-primary lg:text-xl font-semibold">ข้อมูลสินค้า</label>
                                                    </div>
                                                    <div className='text-red-default text-xs'>
                                                        {'*'}ระบุประเภท ขนาดและจำนวนที่เข้ารับ
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-y-2'>
                                                    {
                                                        state.items.filter(x =>
                                                            x.recv_id == recv.recv_id
                                                        ).map((item, itemIndex) => {

                                                            return <div key={`items-${itemIndex}`} className='flex flex-col gap-y-4'>
                                                                <div className='flex flex-1 flex-col sm:flex-row gap-4'>
                                                                    <div className='flex flex-1 flex-col gap-y-2 relative'>
                                                                        <SelectComponent
                                                                            name="type_box"
                                                                            required
                                                                            label={"เลือกประเภทกล่อง"}
                                                                            value={item.type_id}
                                                                            onChange={(e) => {
                                                                                const items = [...state.items];
                                                                                const index = items.findIndex(x => x.id == item.id);
                                                                                items[index].type_id = e?.value ?? "";
                                                                                items[index].type_name = e?.label ?? "";
                                                                                setState({ ...state, items: items });
                                                                            }}

                                                                            options={recv.recv_id?.toString().includes('9999') ? boxTypes.filter(x => x.label == "Test Box") : boxTypes.filter(x => x.label != "Test Box")} />
                                                                    </div>
                                                                    <div className='flex flex-1 flex-col gap-y-2 relative'>
                                                                        <SelectComponent
                                                                            name="service_type"
                                                                            label={"เลือกบริการ"}
                                                                            value={item.service_id}
                                                                            required
                                                                            onChange={(e) => {
                                                                                const items = [...state.items];
                                                                                const index = items.findIndex(x => x.id == item.id);
                                                                                if (e?.value) {
                                                                                    var service_id = e?.value;
                                                                                    items[index].service_id = service_id;
                                                                                    items[index].service_name = e?.label ?? "";
                                                                                } else {
                                                                                    items[index].service_id = "";
                                                                                    items[index].service_name = "";
                                                                                }
                                                                                setState({ ...state, items: items });
                                                                            }}

                                                                            options={
                                                                                item.type_name == "Cool Box" ? boxServices :
                                                                                    boxServices.filter(x => x.value == 1)
                                                                            } />
                                                                    </div>
                                                                    <div className='flex flex-1 flex-col gap-y-2 relative'>
                                                                        <div className='flex flex-col'>
                                                                            <SelectComponent
                                                                                name="product_type_id"
                                                                                label={"เลือกประเภทสินค้า"}
                                                                                value={item.product_type_id}
                                                                                required
                                                                                onChange={(e) => {
                                                                                    const items = [...state.items];
                                                                                    const index = items.findIndex(x => x.id == item.id);
                                                                                    items[index].product_type_id = e?.value ?? "";
                                                                                    items[index].product_type_name = e?.label ?? "";
                                                                                    items[index].product_default_name = e?.label ?? "";
                                                                                    setState({ ...state, items: items });
                                                                                }}
                                                                                options={productType.map(x => {
                                                                                    return {
                                                                                        value: x.id,
                                                                                        label: x.product_type_name
                                                                                    }
                                                                                })} />
                                                                            {
                                                                                item.product_default_name == "อื่นๆ" &&
                                                                                <div className='flex-1 relative'>
                                                                                    <InputComponent
                                                                                        name="product_type_name"
                                                                                        label="อื่นๆ โปรดระบุ"
                                                                                        placeholder="อื่นๆ โปรดระบุ"
                                                                                        onChange={(e) => {
                                                                                            const items = [...state.items];
                                                                                            const index = items.findIndex(x => x.id == item.id);
                                                                                            items[index].product_type_name = e.target?.value ?? "";
                                                                                            setState({ ...state, items: items });
                                                                                        }}
                                                                                        value={item.product_type_name == "อื่นๆ" ? "" : item.product_type_name}
                                                                                        errors={fieldErrors}
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                            }
                                                                        </div>

                                                                    </div>
                                                                    <div className='flex flex-1 flex-col gap-y-2 relative'>
                                                                        <SelectComponent
                                                                            label={"เลือกขนาดกล่อง"}
                                                                            required
                                                                            value={item.size_id}
                                                                            onChange={(e) => {
                                                                                const items = [...state.items];
                                                                                const index = items.findIndex(x => x.id == item.id);
                                                                                items[index].size_id = e?.value ?? "";
                                                                                items[index].size_name = e?.label ?? "";
                                                                                setState({ ...state, items: items });
                                                                            }}
                                                                            options={boxSizes.filter(x => x.type_id == parseInt(item.type_id))} />
                                                                    </div>
                                                                    <div className='flex flex-1 gap-x-1 items-center h-fit'>
                                                                        <div className='flex-1 relative'>
                                                                            <InputComponent
                                                                                name="item-quantity"
                                                                                label="จำนวน"
                                                                                placeholder="จำนวน"
                                                                                type='number'
                                                                                min={1}
                                                                                onChange={(e) => {
                                                                                    const items = [...state.items];
                                                                                    const index = items.findIndex(x => x.id == item.id);
                                                                                    items[index].amount = e.target?.value ?? "";
                                                                                    setState({ ...state, items: items });
                                                                                }}
                                                                                value={item.amount}
                                                                                errors={fieldErrors}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='flex flex-1 gap-x-1 items-center h-fit'>
                                                                    <div className='flex-1 relative'>
                                                                        <InputComponent
                                                                            name="item-remark"
                                                                            label="หมายเหตุ"
                                                                            placeholder="หมายเหตุ"
                                                                            min={1}
                                                                            onChange={(e) => {
                                                                                const items = [...state.items];
                                                                                const index = items.findIndex(x => x.id == item.id);
                                                                                items[index].remark = e.target?.value ?? "";
                                                                                setState({ ...state, items: items });
                                                                            }}
                                                                            value={item.remark}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        onClick={() => {
                                                                            const newItems = [...state.items];
                                                                            const index = newItems.findIndex(x => x.id == item.id);
                                                                            newItems.splice(index, 1);
                                                                            setState({ ...state, items: newItems });
                                                                        }}
                                                                        className='p-2 cursor-pointer'>
                                                                        <TrashIcon className='h-8 w-8 text-red-default sm:block' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                    {
                                                        fieldErrors.items && <span name="items_validate" className='text-red-500 text-sm'>{fieldErrors.items}</span>
                                                    }
                                                    <button type="button"
                                                        onClick={() => {
                                                            if (!recv.recv_zipcode) {
                                                                toast.error("กรุณาระบุที่อยู่ผู้รับก่อน", {
                                                                    style: {
                                                                        borderRadius: '10px',
                                                                        background: '#333',
                                                                        color: '#fff',
                                                                    },
                                                                    className: "text-lg"
                                                                })
                                                            } else {
                                                                const items = [...state.items];
                                                                items.push({
                                                                    id: +new Date(),
                                                                    type_id: "",
                                                                    type_name: "",
                                                                    service_id: "",
                                                                    service_name: "",
                                                                    size_id: "",
                                                                    size_name: "",
                                                                    product_type_id: "",
                                                                    product_type_name: "",
                                                                    product_default_name: "",
                                                                    amount: 1,
                                                                    price: 0,
                                                                    is_insurance: false,
                                                                    estimate_value: "",
                                                                    weight: "",
                                                                    insurance_price: 0,
                                                                    remark: "",
                                                                    recv_province: recv.recv_province,
                                                                    recv_district: recv.recv_district,
                                                                    recv_subdistrict: recv.recv_subdistrict,
                                                                    recv_zipcode: recv.recv_zipcode,
                                                                    recv_id: recv.recv_id,
                                                                    remark: ""
                                                                })
                                                                setState({ ...state, items: items });
                                                            }
                                                        }}
                                                        className='flex mt-2 w-40 bg-blue-primary rounded-lg text-white text-lg p-2 justify-center items-center'>
                                                        <img className="h-5 mx-2" src="/assets/icons/plus-circle.svg" />
                                                        เพิ่มรายการ
                                                    </button>
                                                </div>
                                            </div>

                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        })
                    }
                </div>

                <div className='flex items-center justify-between lg:justify-start h-18 lg:h-22 mr-5 lg:mr-24 pl-5 lg:pl-24 bg-gradient-to-l from-blue-sky to-blue-white rounded-br-100 my-7'>
                    <img className="-mt-7 h-14 lg:h-20" src="/assets/images/boxSizeTitle.webp" />
                    <label className='text-primary text-xs lg:text-2xl font-semibold ml-3 lg:ml-10'>หากไม่ทราบขนาดกล่อง ท่านสามารถคำนวนขนาดได้</label>
                    <div className='flex flex-col mt-5 mr-12 lg:ml-10 shrink-0'>
                        <button onClick={() => {
                            setIsModalImage(true);
                        }} type='button' className='bg-white rounded-lg text-xs lg:text-lg text-blue-primary font-semibold italic px-5 lg:px-10 py-2'>คลิกที่นี่</button>
                        <img className="-mt-3 -mr-3 lg:-mb-3 h-7 lg:h-10 self-end" src="/assets/images/cursor.webp" />
                    </div>
                </div>
                <div className='px-5 lg:px-24 py-7'>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='flex gap-3 items-center'>
                            <img className="h-7 lg:h-10" src="/assets/icons/calendar.svg" />
                            <label className="text-blue-primary lg:text-xl font-semibold">วันและเวลาที่ต้องการให้รับสินค้า</label>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-x-3 max-w-5xl'>
                        {/* <div>
                        <InputComponent name="date" value="" placeholder="วว / ดด / ปป" />
                    </div>
                    <div>
                        <SelectComponent label="ทุกช่วงเวลา" />
                    </div> */}
                        {/* <div className='flex items-center border-2 rounded-lg p-3 text-xs lg:text-base'>
                        <img className="h-5 mr-3" src="/assets/icons/calendar-gray.svg" />
                        <input className='w-28 lg:w-full' placeholder='วว / ดด / ปป' />
                        <DatePicker selected={state.book_date} onChange={(date) => setState({
                            ...state,
                            book_date: date
                        })} />
                    </div> */}
                        <div className='flex flex-col'>
                            <DatePicker
                                minDate={moment().format('HH') >= 12 ? moment().add(userState.paymentmethod == 1 ? 0 : 1, 'day').toDate() : moment().toDate()}
                                maxDate={moment().add(7, 'days').toDate()}
                                //maxDate={isCustomerCenter ? moment().add(7, 'days').toDate() : moment(new Date("04-11-2025")).toDate()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control w-full"
                                name='book_date'
                                selected={moment(state.book_date).toDate()}
                                onChange={(date) => {
                                    setState({
                                        ...state,
                                        book_date: date
                                    })
                                }} />
                            <span className='text-red-500 text-sm'>{fieldErrors["book_date"]}</span>
                        </div>

                        {/* <div className='flex w-full relative'>
                            <SelectComponent
                                name="book_period"
                                label={"ช่วงเวลา"}
                                value={state.book_period}
                                onChange={(e) => {
                                    setState({ ...state, book_period: e?.value ?? "", book_period_name: e?.label })
                                }}
                                errors={fieldErrors}
                                required
                                options={timePeriod} />

                        </div> */}
                    </div>
                </div>
                <div className='px-5 lg:px-24 py-7'>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='flex gap-3'>
                            <img className="h-7 lg:h-10" src="/assets/icons/comment.svg" />
                            <label className="text-blue-primary lg:text-xl font-semibold">ข้อความถึงพนักงาน</label>
                        </div>
                    </div>


                    <div className=''>
                        <InputComponent
                            isInput={false}
                            name="order_remark"
                            label=""
                            rows={4}
                            placeholder='รายละเอียดอื่นๆ (ขนาดกล่องพัสดุ หรือประเภทสินค้า เช่น อาหารสด ดอกไม้ ของใช้ทั่วไป เป็นต้น)'
                            onChange={(e) => setState({ ...state, order_remark: e.target.value })}
                            value={state.order_remark}
                            errors={fieldErrors}
                            required
                        />
                    </div>

                </div>
                <div className='px-5 lg:px-24 py-7'>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='flex gap-3 items-center'>
                            <img className="h-7 lg:h-10" src="/assets/icons/box-alt.svg" />
                            <label className="text-blue-primary lg:text-xl font-semibold">การจัดส่ง</label>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='flex items-center mt-2'>
                            {/* <input
                                // onChange={(e) => onChange(e)}
                                className='border-2 border-gray-thin indeterminate:bg-gray-thin'
                                type="checkbox" id="checkbox"
                                name="checkbox" value="checkbox"
                            />
                            <label className='text-sm lg:text-lg px-3 text-[#333]'>จัดส่งที่สาขา</label> */}
                            <RadioGroup value={selected} onChange={setSelected}>
                                <div className="space-x-2 flex">
                                    {typeBusiness.map((plan) => (
                                        <RadioGroup.Option
                                            key={plan.name}
                                            value={plan}
                                            className={({ active, checked }) =>
                                                `
                                        ${checked ? 'bg-blue-secondary bg-opacity-75 text-blue-primary' : 'bg-white'
                                                }
                                        relative shadow-md rounded-lg border-2 px-5 py-2 cursor-pointer flex ml-2`
                                            }
                                        >
                                            {({ active, checked }) => (
                                                <>
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center">
                                                            <div className="text-sm">
                                                                <RadioGroup.Label
                                                                    as="p"
                                                                    className={`font-medium  ${checked ? 'text-blue-primary' : 'text-gray-900'
                                                                        }`}
                                                                >
                                                                    {plan.label}
                                                                </RadioGroup.Label>
                                                            </div>
                                                        </div>
                                                        {checked && (
                                                            <div className="flex-shrink-0 text-white">
                                                                <CheckIcon className="w-6 h-6 text-blue-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    {/* {
                        selected.value && <div className='flex flex-1 flex-col gap-y-2 relative'>
                            <SelectComponent
                                label={"เลือกสาขา"}
                                name="dropoff_code"
                                required
                                value={state.dropoff_code}
                                onChange={(e) => {
                                    setState({ ...state, dropoff_code: e?.value });
                                }}
                                options={dropoff_master} />
                        </div>
                    } */}

                </div>
                <div className='text-red-default text-xs lg:text-sm italic px-5 lg:px-24'>
                    {'*'}ยกเว้น!!! พัสดุที่ไม่สามารถจัดส่งได้ ได้แก่ สิ่งผิดกฎหมาย เอกสารสำคัญ สัตว์ สิ่งมีชีวิต และวัตถุอันตราย
                </div>
                <div className='px-5 lg:px-24 py-7'>
                    <div className='flex flex-col bg-gray-thin_light rounded-large lg:rounded-lg w-full p-5 gap-5'>
                        <div className='flex items-center'>
                            <img className="h-5 lg:h-7" src="/assets/icons/clock.svg" />
                            <label className="text-xs lg:text-sm text-gray-text font-semibold ml-3">สำหรับต้นทาง กทม,นนทบุรี,ปทุมธานี และ สมุทรปราการ กรุณาจองก่อน 12:00 น.
                                เจ้าหน้าที่จะเข้ารับพัสดุภายในวันที่ทำการจอง หากจองรถหลังเที่ยง รถจะเข้ารับพัสดุในวันทำการถัดไป
                            </label>
                        </div>
                        <div className='flex'>
                            <img className="h-5 lg:h-7" src="/assets/icons/shipping-timed.svg" />
                            <label className="text-xs lg:text-sm text-gray-text font-semibold ml-3">การเข้ารับพัสดุ 1 - 4 ออเดอร์ ค่าบริการ 50 บาท/ครั้ง , 5 ออเดอร์ขึ้นไป เข้ารับฟรี </label>
                        </div>
                    </div>
                </div>
                {/* <div className='flex items-center px-5 lg:px-24'>
                    <input className='border-2 border-gray-thin indeterminate:bg-gray-thin mt-1' type="checkbox" id="checkbox" name="checkbox" value="checkbox" />
                    <label className='text-sm lg:text-lg px-3'>ข้าพเจ้าได้ศึกษาและยอมรับ รายละเอียด เงื่อนไขในการให้บริการรวมถึงนโยบายในการจัดการข้อมูลส่วนบุคคลของบริษัท</label>
                </div> */}
                <div className='flex justify-between p-5 lg:px-24'>
                    <button type="button" className='bg-gray-light text-gray-text text-sm py-3 px-7 w-32 rounded-lg'>ยกเลิก</button>
                    <button type="submit" className='bg-blue-secondary text-white text-sm py-3 px-3  w-32 rounded-lg'>ยืนยันการนัดหมาย</button>
                </div>
            </form>
            {
                isModal && <Modal onClose={() => {
                    setIsModal(false)
                }}
                    isCheck={isCheck}
                    onChange={(e) => {
                        setisCheck(e.target.checked)
                    }}
                    termCondition={configContent.find(x => x.ct_code == 'term_condition')?.html_text ?? ""}
                    onConfirm={appointConfirmModal}
                />
            }
            {
                senderModal && <ModalAddress
                    onClose={() => {
                        setSenderModal(false)
                    }}
                    onConfirm={() => {
                        if (state.sender_id > 0) {
                            let newState = { ...state };
                            const sender = profile.addresses.find(x => x.id == state.sender_id);
                            newState = {
                                ...newState,
                                sender_code: `${sender.zipcode?.trim()}_${sender.subdistrict?.trim()}_${sender.district?.trim()}_${sender.province?.trim()}`,
                                sender_id: sender.id,
                                sender_name: sender.name,
                                sender_tel: sender.phone,
                                sender_tel2: sender.phone2,
                                sender_address: sender.address,
                                sender_province: sender.province,
                                sender_district: sender.district,
                                sender_subdistrict: sender.subdistrict,
                                sender_zipcode: sender.zipcode,
                            }
                            setState(newState);
                            setSenderModal(false);
                            setprofile({ ...profile, defaultSender: sender });
                        } else {
                            setSenderModal(false);
                        }
                    }}
                >
                    <div className='flex gap-y-2 flex-col'>
                        {
                            profile.addresses && profile.addresses.filter(x => x.type == "S").map((item, index) => {
                                return <div key={`sender-${index}`} onClick={() => {
                                    setState({ ...state, sender_id: item.id })
                                }} className={`border rounded-lg p-3 lg:p-5 ${state.sender_id == item.id && "border-blue-secondary border-[2px]"}`}>
                                    <div className='flex justify-between'>
                                        <label className="text-blue-primary font-semibold">ที่อยู่ผู้ส่งสินค้า</label>
                                    </div>
                                    <div className='flex py-3 gap-3 lg:gap-5'>
                                        <img className="h-10" src="/assets/images/location.webp" />
                                        <div className='flex flex-col lg:gap-3'>
                                            <div className='flex gap-3 lg:gap-5'>
                                                <label className="text-sm font-semibold">{item.name}</label>
                                                <label className="text-gray-text text-sm font-semibold">Tel : {item.phone}</label>
                                            </div>
                                            <label className="text-sm">{`${item.address} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</label>
                                            {item.is_default && <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>}
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </ModalAddress>
            }
            {
                receiveModal && <ModalAddress
                    onClose={() => {
                        setReceiveModal(false)
                    }}
                    onConfirm={() => {
                        if (state.recv_id > 0) {
                            let newState = { ...state };
                            const receive = profile.addresses.find(x => x.id == state.recv_id);
                            const itemsReceive = newState.receive_list;

                            const itemsReceiveIndex = newState.receive_list.findIndex(x => x.recv_id == recvIdSelected);

                            itemsReceive[itemsReceiveIndex] = {
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
                            }

                            setState({
                                ...newState,
                                receive_list: itemsReceive
                            });
                            setReceiveModal(false);
                            setprofile({ ...profile, defaultReceive: receive });
                        } else {
                            setReceiveModal(false);
                        }
                    }}
                >
                    <div className='flex gap-y-2 flex-col'>
                        {
                            profile.addresses && profile.addresses.filter(x => x.type == "R").map((item, index) => {
                                return <div key={`receive-${index}`} onClick={() => {
                                    setState({ ...state, recv_id: item.id })
                                }} className={`border rounded-lg p-3 lg:p-5 ${state.recv_id == item.id && "border-blue-secondary border-[2px]"}`}>
                                    <div className='flex justify-between'>
                                        <label className="text-blue-primary font-semibold">ที่อยู่ผู้รับสินค้า</label>
                                    </div>
                                    <div className='flex py-3 gap-3 lg:gap-5'>
                                        <img className="h-10" src="/assets/images/location.webp" />
                                        <div className='flex flex-col lg:gap-3'>
                                            <div className='flex gap-3 lg:gap-5'>
                                                <label className="text-sm font-semibold">{item.name}</label>
                                                <label className="text-gray-text text-sm font-semibold">Tel : {item.phone}</label>
                                            </div>
                                            <label className="text-sm">{`${item.address} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</label>
                                            {item.is_default && <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xs lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับรับสินค้า</button>}
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </ModalAddress>
            }
            {isModalImage && <ImageModal onClose={() => {
                setIsModalImage(false)
            }} >
                <div className='relative'>
                    <img className='object-contain w-full' onClick={() => {
                        setIsModalImage(false);
                    }} src={`/assets/images/price_image.jpg`} />
                    <button onClick={() => {
                        setIsModalImage(false);
                    }} className='bg-[#222222] fixed top-[20px] sm:top-[20px] right-[10%] rounded-[100%] p-1 sm:p-2'>
                        <XIcon className="block h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                </div>
            </ImageModal>
            }
        </div>
    )
};
import path from 'path';
import { promises as fs } from 'fs';
import { CheckFile, CheckPriceBox } from 'utils';
import ApiOrders from 'api/ApiOrders';
import moment from 'moment';
import { CheckIcon, ChevronUpIcon, XIcon } from '@heroicons/react/outline';
import ImageModal from '@components/ImageModal';

export async function getServerSideProps({ params }) {
    const jsonDirectory = path.join(process.cwd(), 'json');
    //Read the json data file data.json
    // const fileContents = await fs.readFile(jsonDirectory + '/address.json', 'utf8');
    const addressJson = await fs.readFile(jsonDirectory + '/th-address.json', 'utf8');
    const result = await ApiMasters.getAddress();
    const resultBox = await ApiMasters.getBox();
    const { typeSize, serviceType, priceTemplate } = resultBox.data;
    const configContent = await ApiMasters.getConfig();
    const dropOff = await ApiMasters.getDropOff();
    const productType = await ApiMasters.getProductType();
    const addressExcept = await ApiMasters.getExceptAddress();
    return {
        props: {
            addresses: JSON.parse(addressJson),
            addressMaster: result.data,
            boxes: typeSize,
            typeSize: typeSize,
            serviceType: serviceType,
            priceTemplateMaster: priceTemplate,
            configContent: configContent.data,
            productType: productType.data,
            dropoff_master: dropOff.data,
            addressExcept: addressExcept.data,
        }
    }
}


export default Appoint;

