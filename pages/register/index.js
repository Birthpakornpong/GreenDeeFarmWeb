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

const Register = ({ filesRequired = [], configContent = [], query = {} }) => {
    const otpRef = useRef(null);
    const router = useRouter()
    const [selected, setSelected] = useState(typeBusiness[0])
    const [isCondition, setisCondition] = useState(false);
    const [state, setState] = useState({
        name: query.name ?? "",
        tax_id: "",
        mobile: "",
        mobile2: "",
        email: query.email ?? "",
        know_us: "",
        password: "",
        confirm_password: "",
        otp: "",
        otp_verify: "",
        is_social: query.name ? true : false,
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
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "กรุณากรอกข้อมูล";
        } else {
            if (fields["password"].length < 8) {
                errors["password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
                formIsValid = false;
            }
        }
        if (!fields["confirm_password"]) {
            formIsValid = false;
            errors["confirm_password"] = "กรุณากรอกข้อมูล";

        } else {
            if (fields["confirm_password"].length < 8) {
                errors["confirm_password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
                formIsValid = false;
            }
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
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "กรุณากรอกข้อมูล";
        } else {
            if (fields["password"].length < 8) {
                formIsValid = false;
                errors["password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
            }
        }
        if (!fields["confirm_password"]) {
            formIsValid = false;
            errors["confirm_password"] = "กรุณากรอกข้อมูล";

        } else {
            if (fields["confirm_password"].length < 8) {
                formIsValid = false;
                errors["confirm_password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
            }
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
            if (state.password !== state.confirm_password) {
                toast.error("ยืนยันรหัสผ่านไม่ตรงกัน", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
            } else {
                try {
                    var isValidFiles = "";

                    filesRequired.filter(x => x.cust_type == 1).map((item, index) => {
                        if (!state[item.doc_type_code]) {
                            isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                        }
                        formData.append('files', state[item.doc_type_code]);
                    });
                    if (isValidFiles) {
                        toast.error(isValidFiles, {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                            className: "text-lg"
                        })
                        return false;
                    }
                    formData.append('state', JSON.stringify({ ...state, customer_type: selected.name }));

                    await sendOTP();
                    // const requestOTP = await ApiUsers.requestOTP({ ...state });
                    // const { status } = requestOTP;
                    // if (status == 200) {
                    //     setmodalOTP(true);
                    // }
                    //const result = await ApiUsers.insert(formData, state.mobile);
                    //toast.dismiss();
                    // const { status } = result;
                    // if (status == 200) {
                    //     toast.success('ลงทะเบียนสำเร็จ!', {
                    //         style: {
                    //             borderRadius: '10px',
                    //             background: '#333',
                    //             color: '#fff',
                    //         },
                    //         duration: 2000
                    //     })
                    //     const successTimeout = setTimeout(() => router.push('/login'), 2000)
                    //     return () => clearTimeout(successTimeout)
                    // }
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


    const submitBusiness = async e => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidationBusiness();

        if (isValid) {
            if (state.password !== state.confirm_password) {
                toast.error("ยืนยันรหัสผ่านไม่ตรงกัน", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
            } else {
                // toast.loading('กรุณารอสักครู่', {
                //     style: {
                //         borderRadius: '10px',
                //         background: '#333',
                //         color: '#fff',
                //     },
                // });
                try {
                    var isValidFiles = "";

                    filesRequired.filter(x => x.cust_type == 2).map((item, index) => {
                        if (!state[item.doc_type_code]) {
                            isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                        }
                        formData.append('files', state[item.doc_type_code]);
                    });
                    if (isValidFiles) {
                        toast.error(isValidFiles, {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                            className: "text-lg"
                        })
                        return false;
                    }
                    formData.append('state', JSON.stringify({ ...state, customer_type: selected.name }))
                    await sendOTP();
                    // const result = await ApiUsers.insert(formData, state.mobile);
                    // toast.dismiss();
                    // const { status } = result;
                    // if (status == 200) {
                    //     toast.success('ลงทะเบียนสำเร็จ!', {
                    //         style: {
                    //             borderRadius: '10px',
                    //             background: '#333',
                    //             color: '#fff',
                    //         },
                    //         duration: 2000
                    //     })
                    //     const successTimeout = setTimeout(() => router.push('/login'), 2000)
                    //     return () => clearTimeout(successTimeout)
                    // }
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
        const formData = new FormData();

        try {
            var isValidFiles = "";

            filesRequired.filter(x => x.cust_type == 1).map((item, index) => {
                if (!state[item.doc_type_code]) {
                    isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                }
                formData.append('files', state[item.doc_type_code]);
            });
            if (isValidFiles) {
                toast.error(isValidFiles, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
                return false;
            }
            formData.append('state', JSON.stringify({ ...state, customer_type: selected.name }));
            const result = await ApiUsers.insert(formData, state.mobile);
            toast.dismiss();
            const { status } = result;
            if (status == 200) {
                toast.success('ลงทะเบียนสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                })
                const successTimeout = setTimeout(() => router.push('/login'), 2000)
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
            <TitleMenu title={"สมัครเข้าใช้งาน"} imageSrc="/assets/images/registerTitle.webp" />
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
                            <div className="w-full relative">
                                <SelectComponent
                                    label={"รู้จักเราจาก"}
                                    value={state.know_us}
                                    onChange={(e) => setState({ ...state, know_us: e?.value ?? "" })}
                                    options={options} />
                            </div>
                            <div className="w-full relative">
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    type="password"
                                    name="password"
                                    label="รหัสผ่าน"
                                    placeholder={"รหัสผ่าน"}
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                    value={state.password}
                                    errors={fieldErrors}
                                    required
                                />
                                <span className="text-sm text-gray-400 flex mt-1">* กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร</span>
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    type="password"
                                    name="confirm_password"
                                    label="ยืนยันรหัสผ่าน"
                                    placeholder={"ยืนยันรหัสผ่าน"}
                                    onChange={(e) => setState({ ...state, confirm_password: e.target.value })}
                                    value={state.confirm_password}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                        </div>
                        {filesRequired.filter(x => x.cust_type == 1).length > 0 &&
                            <div className="flex mt-5 flex-col gap-y-5">
                                <label className="text-blue-primary text-lg font-bold">แนบเอกสารที่เกี่ยวข้อง</label>
                                <div className="flex gap-x-5 grid grid-cols-2 justify-between">
                                    {
                                        filesRequired.filter(x => x.cust_type == 1).map((item, index) => {
                                            return <>
                                                <div className="flex flex-col gap-y-4">
                                                    <span>{item.doc_type} <span className="text-sm text-gray-400">(แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.)</span></span>
                                                    <label htmlFor={`file_${item.doc_type_code}`} className="border-dotted border p-4 flex items-center border-[#15466e] rounded bg-[#f9fafc] text-sm flex-col cursor-pointer">
                                                        <div className="flex gap-x-2">
                                                            <span className="text-center">{state[item.doc_type_code]?.name?.replace(`_type_${item.doc_type_code}`, "") ?? "ลากและวางไฟล์ที่นี่เพื่อแนบ หรือ"}</span>
                                                            <div className="bg-[#15466e] text-white px-3 rounded">แนบเอกสาร</div>
                                                        </div>
                                                        <input id={`file_${item.doc_type_code}`} type="file" name="files"
                                                            // multiple 
                                                            // accept="image/png, image/jpeg"
                                                            className="hidden" onChange={(e) => {
                                                                if (e.target.files[0]) {
                                                                    let message = CheckFile({
                                                                        file: e.target.files[0],
                                                                        size: 2,
                                                                        type: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
                                                                        message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น",
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
                                                                        const ext = path.extname(e.target.files[0].name);
                                                                        const fileName = `${v4()}${ext}`;
                                                                        const files = new File([e.target.files[0]], fileName + `_type_${item.doc_type_code}`,
                                                                            {
                                                                                type: e.target.files[0].type,
                                                                                lastModified: e.target.files[0].lastModified
                                                                            }
                                                                        )
                                                                        setState({ ...state, [item.doc_type_code]: files })
                                                                    }
                                                                } else {
                                                                    setState({ ...state, [item.doc_type_code]: "" })
                                                                }

                                                            }} />
                                                    </label>
                                                </div>
                                            </>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            configContent.filter(x => x.ct_code == "term_condition" || x.ct_code == 'claim').map((item, index) => {
                                return <div key={`config-${index}`} className="mx-2 sm:mx-0 p-5 bg-blue-secondary_light mt-10 rounded-xl">
                                    <h3 className="text-blue-primary text-base">{item.ct_desc}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: item.html_text }}>

                                    </div>
                                </div>
                            })
                        }
                        <div className="form-check mx-2 sm:mx-0 mt-5">
                            <input checked={isCondition} onChange={(e) => {
                                setisCondition(e.target.checked)
                            }} className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label inline-block text-gray-800 text-lg font-bold" htmlFor="flexCheckDefault">
                                ยอมรับเงื่อนไขและข้อกำหนด
                            </label>
                        </div>
                        <button disabled={!isCondition} className="px-16 mt-5 py-3 bg-blue-secondary w-64 rounded-md text-white mx-2 mt-3">
                            สมัครใช้งาน
                        </button>
                    </form>
                }
                {selected.name == "business" &&
                    <form onSubmit={submitBusiness} className="w-full flex flex-col" style={{ marginTop: '-0.75rem' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  flex-1 px-2 ">
                            <div className="w-full relative">
                                <InputComponent
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
                                <div className="w-full relative">
                                    <SelectComponent
                                        label={"รู้จักเราจาก"}
                                        value={state.know_us}
                                        onChange={(e) => setState({ ...state, know_us: e?.value ?? "" })}
                                        options={options} />
                                </div>
                            </div>
                            <div className="w-full relative">
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    type="password"
                                    name="password"
                                    label="รหัสผ่าน"
                                    placeholder={"รหัสผ่าน"}
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                    value={state.password}
                                    errors={fieldErrors}
                                    required
                                />
                                <span className="text-sm text-gray-400 flex mt-1">* กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร</span>
                            </div>
                            <div className="w-full relative">
                                <InputComponent
                                    type="password"
                                    name="confirm_password"
                                    label="ยืนยันรหัสผ่าน"
                                    placeholder={"ยืนยันรหัสผ่าน"}
                                    onChange={(e) => setState({ ...state, confirm_password: e.target.value })}
                                    value={state.confirm_password}
                                    errors={fieldErrors}
                                    required
                                />
                                <span className="text-sm text-gray-400 flex mt-1">* กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร</span>
                            </div>
                        </div>
                        {filesRequired.filter(x => x.cust_type == 2).length > 0 &&
                            <div className="flex mt-5 flex-col gap-y-5">
                                <label className="text-blue-primary text-lg font-bold">แนบเอกสารที่เกี่ยวข้อง</label>
                                <div className="flex gap-x-5 gap-y-4 grid grid-cols-2 justify-between">
                                    {
                                        filesRequired.filter(x => x.cust_type == 2).map((item, index) => {
                                            return <>
                                                <div className="flex flex-col gap-y-4">
                                                    <span>{item.doc_type} <span className="text-sm text-gray-400">(แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.)</span></span>
                                                    <label htmlFor={`file_${item.doc_type_code}`} className="border-dotted border p-4 flex items-center border-[#15466e] rounded bg-[#f9fafc] text-sm flex-col cursor-pointer">
                                                        <div className="flex gap-x-2">
                                                            <span className="text-center">{state[item.doc_type_code]?.name?.replace(`_type_${item.doc_type_code}`, "") ?? "ลากและวางไฟล์ที่นี่เพื่อแนบ หรือ"}</span>
                                                            <div className="bg-[#15466e] text-white px-3 rounded">แนบเอกสาร</div>
                                                        </div>
                                                        <input id={`file_${item.doc_type_code}`} type="file" name="files"
                                                            // multiple 
                                                            // accept="image/png, image/jpeg"
                                                            className="hidden" onChange={(e) => {
                                                                if (e.target.files[0]) {
                                                                    let message = CheckFile({
                                                                        file: e.target.files[0],
                                                                        size: 2,
                                                                        type: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
                                                                        message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น",
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
                                                                        const ext = path.extname(e.target.files[0].name);
                                                                        const fileName = `${v4()}${ext}`;
                                                                        const files = new File([e.target.files[0]], fileName + `_type_${item.doc_type_code}`,
                                                                            {
                                                                                type: e.target.files[0].type,
                                                                                lastModified: e.target.files[0].lastModified
                                                                            }
                                                                        )
                                                                        setState({ ...state, [item.doc_type_code]: files })
                                                                    }

                                                                } else {
                                                                    setState({ ...state, [item.doc_type_code]: "" })
                                                                }

                                                            }} />
                                                    </label>
                                                </div>
                                            </>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            configContent.filter(x => x.ct_code == "term_condition" || x.ct_code == 'claim').map((item, index) => {
                                return <div key={`config-content-${index}`} className="mx-2 sm:mx-0 p-5 bg-blue-secondary_light mt-10 rounded-xl">
                                    <h3 className="text-blue-primary text-base">{item.ct_desc}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: item.html_text }}>

                                    </div>
                                </div>
                            })
                        }
                        {/* <div className="mx-2 sm:mx-0 p-5 bg-blue-secondary_light mt-10 rounded-xl">
                            <h3 className="text-blue-primary text-base">เงื่อนไขและข้อกำหนด</h3>
                            <ul className="list-square">
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                            </ul>
                        </div>
                        <div className="mx-2 sm:mx-0 p-5 bg-blue-secondary_light mt-5 rounded-xl">
                            <h3 className="text-blue-primary text-base">การชดใช้ค่าเสียหายของสินค้า (Claim Process)</h3>
                            <ul className="list-square">
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet, nibh vel cursus posuere, quam ex elementum nisl, id semper lacus mi molestie arcu</li>
                            </ul>
                        </div> */}
                        <div className="form-check mx-2 sm:mx-0 mt-5">
                            <input checked={isCondition} onChange={(e) => {
                                setisCondition(e.target.checked)
                            }} className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label inline-block text-gray-800 text-lg font-bold" htmlFor="flexCheckDefault">
                                ยอมรับเงื่อนไขและข้อกำหนด
                            </label>
                        </div>
                        <button disabled={!isCondition} className="px-16 mt-5 py-3 bg-blue-secondary w-64 rounded-md text-white mx-2 mt-3">
                            สมัครใช้งาน
                        </button>
                    </form>
                }

            </div>
        </div >
    )
}

export async function getServerSideProps({ query }) {
    const result = await ApiUsers.getFilesRequired();
    const config = await ApiMasters.getConfig();
    return {
        props: {
            filesRequired: result.data,
            configContent: config.data,
            query: query
        }
    }
}


export default Register;
