import CustomModal from "@components/CustomModal/CustomModal";
import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import ApiUsers from "api/ApiUsers";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { setLocalStorage, useInterval } from "utils";

export default function ResetPassword() {
    const otpRef = useRef(null);
    const router = useRouter()
    const dispatch = useDispatch();
    const [step, setstep] = useState(1);
    const [state, setState] = useState({
        email: "",
        password: "",
        password: "",
        confirm_password: "",
        otp: "",
        otp_verify: "",
        username: "",
    });
    const [fieldErrors, setFieldErrors] = useState({

    });

    const [timeOTP, settimeOTP] = useState(0);

    const [modalOTP, setmodalOTP] = useState(false);

    const submit = async e => {
        e.preventDefault();
        const isValid = await handleValidation();
        if (isValid) {
            try {
                await sendOTP();
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

    const resetPassword = async e => {
        e.preventDefault();
        const isValid = await handleValidationConfirm();
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
                    const result = await ApiUsers.resetPasswordConfirm({
                        username: state.username,
                        password: state.password
                    });
                    toast.dismiss();
                    const { status } = result;
                    if (status == 200) {
                        toast.success('รีเซ็ตรหัสผ่านสำเร็จ!', {
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
    }

    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "กรุณากรอกข้อมูล";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const handleValidationConfirm = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["confirm_password"]) {
            formIsValid = false;
            errors["confirm_password"] = "กรุณากรอกข้อมูล";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    useInterval(() => {
        settimeOTP(timeOTP - 1)
    }, timeOTP == 0 ? null : 1000);

    const sendOTP = async () => {
        if (timeOTP > 0) {
            return false;
        }

        setState({ ...state, otp: "" });

        const requestOTP = await ApiUsers.resetPassword({ ...state });
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
            setstep(2);
            setmodalOTP(false);
        }
    }

    return (
        <div>
            {modalOTP && <CustomModal onClose={() => {
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
            <Head>
                <title>Reset Password</title>
                <meta name="description" content="Reset Password - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster
                reverseOrder={false}
            />
             <TitleMenu title={"ลืมรหัสผ่าน"} imageSrc="/assets/images/loginTitle.webp" />
            <div className="container mx-auto mt-7 sm:mt-10">
                {
                    step == 1 && <form onSubmit={submit} className="w-full flex flex-wrap" style={{ marginTop: '-0.75rem' }}>
                        <div className="grid grid-cols-1 gap-4 sm:flex w-full flex-wrap ">
                            <div className="flex-1 mx-2 relative">
                                <InputComponent
                                    key="username"
                                    name="username"
                                    label="เบอร์โทรศัพท์ / อีเมล"
                                    placeholder={"เบอร์โทรศัพท์ / อีเมล"}
                                    onChange={(e) => setState({ ...state, username: e.target.value })}
                                    value={state.username}
                                    errors={fieldErrors}
                                    required
                                />
                            </div>
                            <button type="submit" className="px-16 py-3 bg-blue-primary rounded-md text-white mx-2">ลืมรหัสผ่าน</button>
                        </div>
                        <div className="flex-center w-full text-center mt-5">
                            <Link href={"/login"}>
                                <span className="text-link text-blue-secondary">กลับหน้าจอเข้าสู่ระบบ</span>
                            </Link>
                        </div>
                        <div className="flex-center w-full text-center mt-5">

                        </div>
                    </form>
                }
                {
                    step == 2 && <form onSubmit={resetPassword} className="w-full flex flex-wrap flex-col" style={{ marginTop: '-0.75rem' }}>
                        <div className="flex-1 mx-2 relative">
                            <InputComponent
                                disabled={true}
                                placeholder={"เบอร์โทรศัพท์ / อีเมล"}
                                // onChange={(e) => setState({ ...state, email: e.target.value })}
                                value={state.username}
                                readonly
                            />
                        </div>
                        <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4 flex-1 px-2 ">
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
                        <div className="flex-center w-full text-center mt-5">
                            <Link href={"/login"}>
                                <span className="text-link text-blue-secondary">กลับหน้าจอเข้าสู่ระบบ</span>
                            </Link>
                        </div>
                        <div className="flex-center w-full text-center mt-5">
                            <button className="px-16 mt-5 py-3 bg-blue-primary w-64 rounded-md text-white mx-2 mt-3">
                                ตั้งค่ารหัสผ่าน
                            </button>
                        </div>
                    </form>
                }

            </div>
        </div>
    )
}

