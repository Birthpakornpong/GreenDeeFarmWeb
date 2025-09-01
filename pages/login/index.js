import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import ApiUsers from "api/ApiUsers";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { setLocalStorage } from "utils";
import { getCsrfToken, getProviders, signIn, useSession, signOut } from "next-auth/react"
import { SocialIcon } from 'react-social-icons';
import Autosuggest from "react-autosuggest";
import CustomModal from "@components/CustomModal/CustomModal";

export default function Login({ providers = [] }) {
    const [value, setValue] = useState("");
    const [modalUsers, setmodalUsers] = useState(false);
    const { data: session, status } = useSession()
    const router = useRouter()
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const userState = useSelector(state => state.user);
    const [fieldErrors, setFieldErrors] = useState({

    });

    const submit = async e => {
        e.preventDefault();
        const isValid = await handleValidation();
        if (isValid) {
            try {
                const result = await ApiUsers.login(state);
                const { data, status } = result;
                if (status == 200) {
                    if (data.isCustomerCenter) {
                        setmodalUsers(true);
                        dispatch({ type: "set", isCustomerCenter: true });
                    } else {
                        setLocalStorage('token', data.accessToken);
                        const resultUser = await ApiUsers.getUserProfile();
                        if (resultUser.status == 200) {
                            dispatch({ type: "set", user: resultUser.data.userData, isCustomerCenter: false });
                            router.push('/');
                        }
                    }

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

    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "กรุณากรอกข้อมูล";
        }
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "กรุณากรอกข้อมูล";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    useEffect(() => {
        if (status === "authenticated") {
            if (!userState?.username) {
                loginWithSocial();
            }
        }
    }, [status]);

    const loginWithSocial = async () => {
        try {
            const result = await ApiUsers.login({
                email: session?.user.email,
                is_social: true,
            });
            const { data, status } = result;
            if (status == 200) {
                setLocalStorage('token', data.accessToken);
                const resultUser = await ApiUsers.getUserProfile();
                if (resultUser.status == 200) {
                    dispatch({ type: "set", user: resultUser.data.userData });
                    router.push('/');
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                const data = await signOut({ redirect: false, callbackUrl: `/register?name=${session.user.name}&email=${session.user.email}` })
                router.push(data.url);
            }
        }
    }

    const loginWithCustomerCenter = async () => {
        try {
            const result = await ApiUsers.loginNoAuth({
                email: value,
                is_social: false,
            });
            const { data, status } = result;
            if (status == 200) {
                setmodalUsers(false)
                setValue('');
                setLocalStorage('token', data.accessToken);
                const resultUser = await ApiUsers.getUserProfile();
                if (resultUser.status == 200) {
                    dispatch({ type: "set", user: resultUser.data.userData });
                    router.push('/');
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                const data = await signOut({ redirect: false, callbackUrl: `/register?name=${session.user.name}&email=${session.user.email}` })
                router.push(data.url);
            }
        }
    }

    return (
        <div>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login page - Fuze Application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster
                reverseOrder={false}
            />
                <TitleMenu title={"เข้าสู่ระบบ"} imageSrc="/assets/images/loginTitle.webp" />
         
            <div className="container mx-auto mt-7 sm:mt-10">
                <form onSubmit={submit} className="w-full flex flex-wrap" style={{ marginTop: '-0.75rem' }}>

                    <div className="grid grid-cols-1 gap-4 sm:flex w-full flex-wrap ">

                        <div className="flex-1 mx-2 relative">
                            <InputComponent
                                key="email"
                                name="email"
                                label="เบอร์โทรศัพท์ / อีเมล"
                                placeholder={"เบอร์โทรศัพท์ / อีเมล"}
                                onChange={(e) => setState({ ...state, email: e.target.value })}
                                value={state.email}
                                errors={fieldErrors}
                                required
                            />
                        </div>
                        <div className="flex-1 mx-2 relative">
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
                        <button type="submit" className="px-16 py-3 bg-blue-primary rounded-md text-white mx-2">เข้าสู่ระบบ</button>
                    </div>
                    <div className="flex-center w-full text-center mt-5">
                        <Link href={"/resetpassword"}>
                            <span className="text-link mr-2">ลืมรหัสผ่าน?</span>
                        </Link>
                        <Link href={"/register"}>
                            <span className="text-link text-blue-secondary italic">สมัครเข้าใช้งาน !&nbsp;</span>
                        </Link>
                        <span>&nbsp;เพื่อรับโปรโมชั่นพิเศษ</span>
                    </div>

                    {/* {Object.values(providers).map((provider) => {
                        return (
                            <div key={provider.name}>
                                <button onClick={() => signIn(provider.id)}>
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        );
                    })} */}
                    {/* <div className="flex-center w-full text-center mt-5">
                        <div className="h-1 w-32 sm:w-40 border-b"></div>
                        <span className="text-gray-text mx-4">หรือ</span>
                        <div className="h-1 w-32 sm:w-40 border-b"></div>
                    </div> */}
                    {/* <div className="flex-center w-full text-center gap-x-4 mt-5">
                        <SocialIcon className="cursor-pointer" network="facebook" onClick={() => signIn("facebook", { callbackUrl: '/login' })}
                        />
                        <SocialIcon className="cursor-pointer" network="google" onClick={() => signIn("google", { callbackUrl: '/login' })}
                        />
                    </div> */}
                </form>

            </div>
            {modalUsers && <CustomModal onClose={() => {
                setmodalUsers(false)
            }}
                onConfirm={() => {
                    loginWithCustomerCenter();
                }}
            >
                <div className="justify-center items-center flex flex-col mb-5">
                    <div className="flex flex-col w-full items-center">
                        <label className="mb-2">กรุณาระบุ E-mail ลูกค้า</label>
                        <AutoSuggestComponent value={value} setValue={setValue} />
                    </div>
                </div>
            </CustomModal>
            }
        </div>
    )
}

function AutoSuggestComponent({ value, setValue }) {

    const [suggestions, setSuggestions] = useState([]);

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };
    const onSuggestionsFetchRequested = async ({ value }) => {
        setSuggestions(await getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const inputProps = {
        placeholder: "E-mail",
        value,
        onChange: onChange
    };

    const getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength < 5) {
            return [];
        } else {
            const result = await ApiUsers.getProfileList({
                username: value
            });
            if (result.status == 200) {
                if (result.data?.userList?.length > 0) {
                    return result.data.userList;
                } else {
                    return [];
                }
            } else {
                return [];
            }

        }
        // return inputLength === 0
        //     ? []
        //     : languages.filter(
        //         (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        //     );
    };

    const getSuggestionValue = (suggestion) => suggestion.email;

    const renderSuggestion = (suggestion) => (
        <div className="p-3  border border-1">{suggestion.email}</div>
    );
    return (
        <div className="w-full">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}

                theme={{
                    container: "w-full mt-2",
                    input: "form-control w-full"
                }}
            />
        </div>
    );
}


// export async function getServerSideProps(context) {
//     return {
//         props: {
//             providers: await providers(context),
//         },
//     };
// }
