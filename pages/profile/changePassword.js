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
import { useDispatch, useSelector } from "react-redux";
import { setLocalStorage, useInterval } from "utils";

export default function ChangePassword() {
    const userState = useSelector(state => state.user);
    const otpRef = useRef(null);
    const router = useRouter()
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: "",
        old_password: "",
        new_password: "",
        confirm_password: "",
        otp: "",
        otp_verify: "",
    });
    const [fieldErrors, setFieldErrors] = useState({

    });


    const resetPassword = async e => {
        e.preventDefault();
        const isValid = await handleValidationConfirm();
        if (isValid) {
            if (state.new_password !== state.confirm_password) {
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
                    const result = await ApiUsers.changePassword({
                        old_password: state.old_password,
                        new_password: state.new_password,
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
                        const successTimeout = setTimeout(() => router.push('/profile/edit'), 2000)
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


    const handleValidationConfirm = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["old_password"]) {
            formIsValid = false;
            errors["old_password"] = "กรุณากรอกข้อมูล";
        } else {
            if (fields["old_password"].length < 8) {
                errors["old_password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
                formIsValid = false;
            }
        }
        if (!fields["new_password"]) {
            formIsValid = false;
            errors["new_password"] = "กรุณากรอกข้อมูล";
        } else {
            if (fields["new_password"].length < 8) {
                errors["new_password"] = "กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร";
                formIsValid = false;
            }
        }
        if (!fields["confirm_password"]) {
            formIsValid = false;
            errors["confirm_password"] = "กรุณากรอกข้อมูล";
        }
        setFieldErrors(errors);
        return formIsValid;
    }



    return (
        <div>

            <Head>
                <title>Reset Password</title>
                <meta name="description" content="Reset Password - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
            </div>
            <div className='px-5 lg:px-24 pt-12'>
                <div className='flex gap-3 items-center'>
                    <label className="text-blue-primary text-lg lg:text-xl font-semibold">เปลี่ยนรหัสผ่าน</label>
                </div>
            </div>
            <div className="px-5 lg:px-24 pt-5">
                <form onSubmit={resetPassword} className="w-full flex flex-wrap flex-col" style={{ marginTop: '-0.75rem' }}>
                    <div className="grid mt-4 grid-cols-1 sm:grid-cols-3 gap-4 flex-1 px-2 ">
                        <div className="w-full relative">
                            <InputComponent
                                type="password"
                                name="old_password"
                                label="รหัสผ่านเดิม"
                                placeholder={"รหัสผ่านเดิม"}
                                onChange={(e) => setState({ ...state, old_password: e.target.value })}
                                value={state.old_password}
                                errors={fieldErrors}
                                required
                            />
                        </div>
                        <div className="w-full relative">
                            <InputComponent
                                type="password"
                                name="new_password"
                                label="รหัสผ่านใหม่"
                                placeholder={"รหัสผ่านใหม่"}
                                onChange={(e) => setState({ ...state, new_password: e.target.value })}
                                value={state.new_password}
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
                        <Link href="/profile/edit">
                            <button type="button" className="px-16 mt-5 py-3 bg-gray-200 w-64 rounded-md mx-2 mt-3">
                                ย้อนกลับ
                            </button>
                        </Link>
                        <button className="px-16 mt-5 py-3 bg-blue-primary w-64 rounded-md text-white mx-2 mt-3">
                            ตั้งค่ารหัสผ่าน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

