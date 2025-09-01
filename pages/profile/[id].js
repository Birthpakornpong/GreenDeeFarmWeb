import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { RadioGroup } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import SelectComponent from "@components/Select";
import toast, { Toaster } from 'react-hot-toast';
import ApiUsers from "api/ApiUsers";
import { useRouter } from "next/router";
import ApiMasters from "api/ApiMasters";
import CustomModal from "@components/CustomModal/CustomModal";
import OtpInput from 'react-otp-input';
import { CheckFile, useInterval, ValidateInput } from "utils";
import { v4 } from 'uuid';
import path from 'path';
import Script from "next/script";
import NextAuth from "next-auth"
import Link from "next/link";
import { useDispatch } from "react-redux";
const typeBusiness = [
    {
        name: 'normal',
        label: "บุคคลทั่วไป"
    },
    {
        name: 'business',
        label: "นิติบุคคล"
    },
]
const options = [
    { value: 'news', label: 'ข่าวสาร' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'Youtube' }
]

const ProfileDetail = ({ filesRequired = [], configContent = [], query = {} }) => {
    const otpRef = useRef(null);
    const dispatch = useDispatch();
    const router = useRouter()
    const [selected, setSelected] = useState(typeBusiness[0])
    const [isCondition, setisCondition] = useState(true);
    const [state, setState] = useState({
        name: query.name ?? "",
        tax_id: "",
        mobile: "",
        mobile2: "",
        email: query.email ?? "",
        wallet: "",
    });

    const [fieldErrors, setFieldErrors] = useState({

    });

    const [modalOTP, setmodalOTP] = useState(false);

    const [timeOTP, settimeOTP] = useState(0);
    let timerID = "";


    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "กรุณากรอก ชื่อ-นามสกุล";
        }
        if (!fields["tax_id"]) {
            formIsValid = false;
            errors["tax_id"] = "กรุณากรอกข้อมูล";
        } else {
            errors["tax_id"] = ValidateInput(fields["tax_id"], "idcard");
            if (errors.tax_id) formIsValid = false;
        }
        if (!fields["mobile"]) {
            formIsValid = false;
            errors["mobile"] = "กรุณากรอกข้อมูล";
        } else {
            errors["mobile"] = ValidateInput(fields["mobile"], "mobile");
            if (errors.mobile) formIsValid = false;
        }
        // if (fields["phone"]) {
        //     errors["phone"] = ValidateInput(fields["phone"], "phone");
        //     if (errors.phone) formIsValid = false;
        // }
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "กรุณากรอกข้อมูล";
        } else {
            errors["email"] = ValidateInput(fields["email"], "email");
            if (errors.email) formIsValid = false;
        }
        if (!fields["wallet"]) {
            // formIsValid = false;
            // errors["wallet"] = "กรุณากรอกข้อมูล";

        } else {
            errors["wallet"] = ValidateInput(fields["wallet"], "mobile");
            if (errors.wallet) formIsValid = false;
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const handleValidationBusiness = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "กรุณากรอก ชื่อ-นามสกุล";
        }
        if (!fields["tax_id"]) {
            formIsValid = false;
            errors["tax_id"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["mobile"]) {
            formIsValid = false;
            errors["mobile"] = "กรุณากรอกข้อมูล";

        } else {
            errors["mobile"] = ValidateInput(fields["mobile"], "mobile");
            if (errors.mobile) formIsValid = false;
        }
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "กรุณากรอกข้อมูล";
        } else {
            errors["email"] = ValidateInput(fields["email"], "email");
            if (errors.email) formIsValid = false;
        }
        if (!fields["wallet"]) {
            // formIsValid = false;
            // errors["wallet"] = "กรุณากรอกข้อมูล";

        } else {
            errors["wallet"] = ValidateInput(fields["wallet"], "mobile");
            if (errors.wallet) formIsValid = false;
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const submit = async e => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidation();
        if (isValid) {
            try {
                register();
            } catch (error) {
                console.log(error)
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
            toast.error("Form has errors.", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
            // alert("Form has errors.");
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        const resultUser = await ApiUsers.getUserProfile();
        dispatch({ type: "set", user: resultUser.data.userData });
        if (resultUser.status == 200) {
            if (resultUser.data) {
                const { userData } = resultUser.data;
                setState({
                    name: userData.name ?? "",
                    tax_id: userData.tax_id,
                    mobile: userData.mobile,
                    mobile2: userData.mobile2,
                    email: userData.email ?? "",
                    wallet: userData.wallet,
                })
                setSelected(typeBusiness.find(x => x.name == userData.customer_type))
                //setSelected(typeBusiness.find(x => x.name == "business"))
            }

            // router.push('/');
        }
    }


    const submitBusiness = async e => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidationBusiness();

        if (isValid) {
            try {
                await register();
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
            toast.error("Form has errors.", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
            // alert("Form has errors.");
        }
    }




    useInterval(() => {
        settimeOTP(timeOTP - 1)
    }, timeOTP == 0 ? null : 1000);

    const sendOTP = async () => {
        if (timeOTP > 0) {
            return false;
        }

        setState({ ...state, otp: "" });

        const requestOTP = await ApiUsers.requestOTP({ ...state });
        if (requestOTP.status == 200) {
            const { otp } = requestOTP.data;
            setTimeout(() => {
                settimeOTP(59);
                setState({ ...state, otp_verify: otp });
                if (!modalOTP) {
                    setmodalOTP(true);
                }
            }, 200);
        }
    }


    const confirmOTP = async () => {
        if (state.otp !== state.otp_verify) {
            toast.error("รหัส OTP ไม่ตรงกัน", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                className: "text-lg"
            })
            setState({ ...state, otp: '' })
        } else {
            await register();
        }
    }

    const register = async () => {
        try {
            const result = await ApiUsers.editProfile(state);
            toast.dismiss();
            const { status } = result;
            if (status == 200) {
                toast.success('แก้ไขข้อมูลสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                })
                getUserProfile();
                const successTimeout = setTimeout(() => router.push('/profile/edit'), 2000)
                return () => clearTimeout(successTimeout)
            }
        } catch (error) {
            console.log(error)
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

    useEffect(() => {
        console.log("filesRequired::", query);
    }, []);
    return (
        <div>
            {modalOTP && <CustomModal onClose={() => {
                settimeOTP(0);
                setmodalOTP(false)
            }}
                onConfirm={() => {
                    confirmOTP();
                }}
            >
                <div className="justify-center items-center flex flex-col mb-5">
                    <div className="flex flex-col items-center">
                        <label className="mb-2">กรอก OTP ที่ได้รับ</label>
                        <OtpInput
                            ref={otpRef}
                            id="otpinput"
                            className="mr-1 sm:mr-4"
                            inputStyle={{
                                width: 50, height: 60, border: '1px solid #efefef', marginRigth: 10, color: 'black',
                                fontSize: 20
                            }}
                            shouldAutoFocus={true}
                            isInputNum
                            value={state.otp}
                            onChange={(text) => setState({ ...state, otp: text })}
                            numInputs={6}
                        // separator={<span>-</span>}
                        />
                        <label className="mb-2 text-gray-700 mt-5" style={{ opacity: timeOTP == 0 ? 1 : 0.5 }}>ไม่ได้รับ OTP? <label onClick={sendOTP}
                            className="cursor-pointer text-black">{`${timeOTP == 0 ? `คลิกที่นี่` : `คลิกที่นี่ (${timeOTP})`}`}
                        </label> เพื่อรับรหัส OTP อีกครั้ง</label>
                    </div>
                </div>
            </CustomModal>
            }
            <Toaster
                reverseOrder={false}
            />
            <Head>
                <title>Register</title>
                <meta name="description" content="Login page - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TitleMenu title={"แก้ไขโปรไฟล์"} imageSrc="/assets/images/registerTitle.webp" />
        
            {/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
            <div className="container mx-auto mt-7 sm:mt-10">
                <div className="w-full mx-2 sm:mx-0 flex mb-10 items-center">
                    <label className="text-blue-primary text-lg font-bold">ประเภทธุรกิจ</label>
                    <RadioGroup value={selected} onChange={setSelected}>
                        <div className="space-x-2 flex">
                            {typeBusiness.map((plan) => (
                                <RadioGroup.Option
                                    key={plan.name}
                                    value={plan}
                                    disabled
                                    className={({ active, checked }) =>
                                        `
                                        ${checked ? 'bg-blue-secondary bg-opacity-75 text-blue-primary' : 'bg-white opacity-50'
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
                {selected.name == "normal" &&
                    <form onSubmit={submit} className="w-full flex flex-col" style={{ marginTop: '-0.75rem' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 px-2 ">
                            <div className="w-full relative">
                                <InputComponent
                                    name="name"
                                    label="ชื่อ-นามสกุล"
                                    placeholder={"ชื่อ-นามสกุล"}
                                    onChange={(e) => setState({ ...state, name: e.target.value })}
                                    value={state.name}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="tax_id"
                                    label="เลขบัตรประชาชน"
                                    placeholder={"เลขบัตรประชาชน"}
                                    onChange={(e) => setState({ ...state, tax_id: e.target.value })}
                                    value={state.tax_id}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="mobile"
                                    label="เบอร์โทรศัพท์มือถือ"
                                    placeholder={"เบอร์โทรศัพท์มือถือ"}
                                    onChange={(e) => setState({ ...state, mobile: e.target.value })}
                                    value={state.mobile}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="mobile2"
                                    label="เบอร์โทรสำรอง"
                                    placeholder={"เบอร์โทรสำรอง"}
                                    onChange={(e) => setState({ ...state, mobile2: e.target.value })}
                                    value={state.mobile2}
                                    errors={fieldErrors}
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="wallet"
                                    label="Wallet ID"
                                    type="tel"
                                    placeholder="Wallet ID (ถ้ามี)"
                                    onChange={(e) => setState({ ...state, wallet: e.target.value })}
                                    value={state.wallet}
                                    errors={fieldErrors}

                                />
                                {/* <InputComponent
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
                                    value={item.wallet ?? ""}
                                    errors={fieldErrors}
                                    required
                                /> */}
                            </div>

                            <div className="w-full relative">
                                <InputComponent
                                    name="email"
                                    label="อีเมล"
                                    required
                                    placeholder={"อีเมล"}
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                    value={state.email}
                                    errors={fieldErrors}
                                />
                            </div>


                        </div>
                        <div className='flex gap-x-4'>
                            <Link href="/profile">
                                <button type="button" className="w-full px-16 py-3 bg-blue-primary w-64 bg-gray-400 rounded-md text-white mt-5">
                                    ย้อนกลับ
                                </button>
                            </Link>
                            <button disabled={!isCondition} className="px-16 mt-5 py-3 bg-blue-secondary w-64 rounded-md text-white mx-2">
                                บันทึกข้อมูล
                            </button>
                        </div>
                    </form>
                }
                {selected.name == "business" &&
                    <form onSubmit={submitBusiness} className="w-full flex flex-col" style={{ marginTop: '-0.75rem' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  flex-1 px-2 ">
                            <div className="w-full relative">
                                <InputComponent
                                    disabled
                                    name="name"
                                    label="ชื่อนิติบุคคล/บริษัท"
                                    placeholder={"ชื่อนิติบุคคล/บริษัท"}
                                    onChange={(e) => setState({ ...state, name: e.target.value })}
                                    value={state.name}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="tax_id"
                                    disabled
                                    label="ทะเบียนนิติบุคคล"
                                    placeholder={"ทะเบียนนิติบุคคล"}
                                    onChange={(e) => setState({ ...state, tax_id: e.target.value })}
                                    value={state.tax_id}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="mobile"
                                    disabled
                                    label="เบอร์โทรศัพท์มือถือ"
                                    placeholder={"เบอร์โทรศัพท์มือถือ"}
                                    onChange={(e) => setState({ ...state, mobile: e.target.value })}
                                    value={state.mobile}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="mobile2"
                                    disabled
                                    label="เบอร์โทรสำนักงาน"
                                    placeholder={"เบอร์โทรสำนักงาน"}
                                    onChange={(e) => setState({ ...state, mobile2: e.target.value })}
                                    value={state.mobile2}
                                    errors={fieldErrors}
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="email"
                                    label="อีเมล"
                                    placeholder={"อีเมล"}
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                    value={state.email}
                                    required
                                    errors={fieldErrors}
                                    disabled
                                />
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    name="wallet"
                                    label="Wallet ID"
                                    type="tel"
                                    placeholder="Wallet ID (ถ้ามี)"
                                    onChange={(e) => setState({ ...state, wallet: e.target.value })}
                                    value={state.wallet}
                                    errors={fieldErrors}

                                />
                                {/* <InputComponent
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
                                    value={item.wallet ?? ""}
                                    errors={fieldErrors}
                                    required
                                /> */}
                            </div>

                        </div>
                        <div className='flex gap-x-4'>
                            <Link href="/profile">
                                <button type="button" className="w-full px-16 py-3 bg-blue-primary bg-gray-400 w-64 rounded-md text-white mt-5">
                                    ย้อนกลับ
                                </button>
                            </Link>
                            <button disabled={!isCondition} className="px-16 mt-5 py-3 bg-blue-secondary w-64 rounded-md text-white mx-2">
                                บันทึกข้อมูล
                            </button>
                        </div>
                    </form>
                }

            </div>
        </div >
    )
}

export async function getServerSideProps(params) {
    const id = params.query.id;
    return {
        props: {
            id: id
            // filesRequired: result.data,
            // configContent: config.data,
            // query: query
        }
    }
}


export default ProfileDetail;
