import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { RadioGroup, Switch } from '@headlessui/react'
import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import SelectComponent from "@components/Select";
import toast, { Toaster } from 'react-hot-toast';
import ApiUsers from "api/ApiUsers";
import { useRouter } from "next/router";
import GoogleMapReact from 'google-map-react';
import ApiMasters from "api/ApiMasters";
import _ from 'lodash';
const AnyReactComponent = ({ text }) => <div>{text}</div>;
const AddAddressReceive = ({ addresses = [] }) => {

    const [provinces, setprovinces] = useState([]);
    const [district, setDistrict] = useState([]);
    const [subdistrict, setSubDistrict] = useState([]);
    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };
    const router = useRouter()
    const [state, setState] = useState({
        sender_code: "",
        name: "",
        phone: "",
        address: "",
        province: "",
        district: "",
        subdistrict: "",
        zipcode: "",
        is_default: true,
        type: "R"
    });

    const [thAddress, setThAddress] = useState([]);

    const [fieldErrors, setFieldErrors] = useState({

    });


    useEffect(() => {
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
    }, []);

    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["zipcode"]) {
            formIsValid = false;
            errors["zipcode"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["sender_code"]) {
            formIsValid = false;
            errors["sender_code"] = "กรุณากรอกข้อมูล";
        }
        setFieldErrors(errors);
        return formIsValid;
    }



    const submit = async (e) => {
        e.preventDefault();
        var isValid = handleValidation();
        if (isValid) {
            try {
                const result = await ApiUsers.insertAddress({
                    name: state.name,
                    phone: state.phone,
                    address: state.address,
                    province: state.province,
                    district: state.district,
                    subdistrict: state.subdistrict,
                    zipcode: state.zipcode,
                    is_default: state.is_default,
                    type: state.type
                });
                const { data, status } = result;
                if (status == 200) {
                    toast.success('เพิ่มที่อยู่สำเร็จ!', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        duration: 2000
                    })
                    const successTimeout = setTimeout(() => router.push('/profile/edit'), 2000)
                    return () => clearTimeout(successTimeout)
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
    }

    useEffect(() => {
        const province = _(addresses)
            .groupBy(o => o.province)
            .map((items, key) => ({ value: key, label: key }))
            .value();
        const amphoe = _(addresses)
            .groupBy(o => o.amphoe)
            .map((items, key) => ({ value: key, label: key, province: items[0].province }))
            .value();
        const district = _(addresses)
            .groupBy(o => o.district)
            .map((items, key) => ({ value: key, label: key, district: items[0].amphoe, provice: items[0].provice, zipcode: items[0].zipcode }))
            .value();
        setprovinces(province);
        setDistrict(amphoe);
        setSubDistrict(district)
    }, []);
    return (
        <div>
            <Toaster
                reverseOrder={false}
            />
            <Head>
                <title>Register</title>
                <meta name="description" content="Login page - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TitleMenu title={"เพิ่มที่อยู่ใหม่"} imageSrc="/assets/images/registerTitle.webp" />
      
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCSEmlBmLYhIzl7Vm-Cz3TivM4V89ogKlc" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}

            >
                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                />
            </GoogleMapReact>
            <div className="container mx-auto mt-7 sm:mt-10">

                {/* <div className="w-full mx-2 sm:mx-0 flex mb-10 items-center">
                    <label className="text-blue-primary text-lg font-bold">ประเภทธุรกิจ</label>
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
                </div> */}
                <form onSubmit={submit} className="w-full flex flex-col gap-y-4" style={{ marginTop: '-0.75rem' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 px-2 ">
                        <div className="w-full relative">
                            <InputComponent
                                name="phone"
                                label="เบอร์โทรศัพท์ผู้รับสินค้า"
                                placeholder={"เบอร์โทรศัพท์ผู้รับสินค้า"}
                                onChange={(e) => setState({ ...state, phone: e.target.value })}
                                value={state.phone}
                                errors={fieldErrors}
                                required
                            />
                        </div>
                        <div className="w-full relative">
                            <InputComponent
                                name="name"
                                label="ชื่อ - นามสกุล ผู้รับสินค้า"
                                placeholder={"ชื่อ - นามสกุล ผู้รับสินค้า"}
                                onChange={(e) => setState({ ...state, name: e.target.value })}
                                value={state.name}
                                errors={fieldErrors}
                                required
                            />
                        </div>

                    </div>
                    <div className="w-full relative px-2">
                        <InputComponent
                            isInput={false}
                            name="address"
                            label="ที่อยู่"
                            placeholder={"ที่อยู่"}
                            onChange={(e) => setState({ ...state, address: e.target.value })}
                            value={state.address}
                            errors={fieldErrors}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1 px-2 ">
                        <div className="w-full relative">
                            <SelectComponent
                                label={"รหัสไปรษณีย์"}
                                onChange={(e) => {
                                    let codeSplit = e?.value?.split("_");
                                    if (codeSplit?.length > 0) {
                                        setState({
                                            ...state, sender_code: e?.value,
                                            zipcode: codeSplit[0],
                                            subdistrict: codeSplit[1],
                                            district: codeSplit[2],
                                            province: codeSplit[3]
                                        });
                                    } else {
                                        setState({
                                            ...state, sender_code: e?.value,
                                            zipcode: "",
                                            subdistrict: "",
                                            district: "",
                                            province: ""
                                        });
                                    }
                                }}
                                value={state.sender_code ?? ""}
                                options={thAddress} />
                        </div>
                        <div className="w-full relative">
                            <InputComponent
                                disabled
                                name="subdistrict"
                                label={"ตำบล"}
                                placeholder={"ตำบล"}
                                value={state?.subdistrict}
                            />
                        </div>
                        <div className="w-full relative">
                            <InputComponent
                                disabled
                                name="zipcode"
                                label={"อำเภอ"}
                                placeholder={"อำเภอ"}
                                value={state?.district}
                            />
                        </div>
                        <div className="w-full relative">
                            <InputComponent
                                disabled
                                name="province"
                                label={"จังหวัด"}
                                placeholder={"จังหวัด"}
                                value={state?.province}
                            />
                        </div>

                    </div>
                    <div className="w-full mx-2 sm:mx-0 flex px-2 items-center gap-x-2">
                        <Switch
                            checked={state.is_default}
                            onChange={(e) => {
                                setState({ ...state, is_default: e })
                            }}
                            className={`${state.is_default ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable notifications</span>
                            <span
                                className={`${state.is_default ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                        <label className="text-blue-primary text-lg font-bold">เป็นที่อยู่เริ่มต้น</label>
                    </div>
                    <div>
                        <Link href="/profile/edit">
                            <button type="button" className="px-16 py-3 bg-blue-secondary bg-gray-400 w-64 rounded-md text-white mx-2">
                                ย้อนกลับ
                            </button>
                        </Link>
                        <button className="px-16 py-3 bg-blue-secondary w-64 rounded-md text-white mx-2">
                            เพิ่มที่อยู่ใหม่
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
import { promises as fs } from 'fs';
import path from 'path';
import Link from "next/link";
export async function getServerSideProps({ params }) {
    const jsonDirectory = path.join(process.cwd(), 'json');
    const addressJson = await fs.readFile(jsonDirectory + '/th-address.json', 'utf8');
    return {
        props: {
            addresses: JSON.parse(addressJson),
        }
    }
}


export default AddAddressReceive;
