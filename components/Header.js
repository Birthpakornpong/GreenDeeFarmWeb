/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, BellIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ConvertDateShortThai, removeLocalStorage } from "utils";
import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
  signOut,
} from "next-auth/react";
import ApiUsers from "api/ApiUsers";
import { PhoneIcon } from "@heroicons/react/solid";
import React from "react";
import Select from "react-select";

const SocialButtons = () => {
  return (
    <div className="flex gap-2">
      <Link
        href="https://www.tiktok.com/@chinjungmeow"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ">
          <img
            className="h-3 w-2"
            src="/assets/icons/Tiktok.png"
            alt="TikTok"
          />
        </div>
      </Link>

      {/* LINE */}
      <Link
        href="https://line.me/ti/p/~birthids"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer"
        style={{ backgroundColor: "#00C300" }}>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ">
          <img className="h-3 w-3" src="/assets/icons/line.png" />
        </div>
      </Link>

      <Link
        href="https://www.facebook.com/profile.php?id=100075999497749"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full  cursor-pointer"
        style={{ backgroundColor: "#1877F2" }}>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ">
          <img
            className="h-3 w-3"
            src="/assets/icons/facebook.png"
            alt="Facebook"
          />
        </div>
      </Link>
    </div>
  );
};

const options = [
  {
    value: "th",
    label: (
      <div className="flex items-center">
        <img
          src="/assets/icons/Language.png"
          alt="Thai Flag"
          className="w-3 h-3 rounded-full mr-2"
        />
        <span>ภาษาไทย</span>
      </div>
    ),
  },
  {
    value: "en",
    label: (
      <div className="flex items-center">
        <img
          src="/assets/icons/Flag.png"
          alt="US Flag"
          className="w-3 h-3 rounded-full mr-2"
        />
        {/* <div className="rounded-full mr-2">
             🇺🇸
        </div> */}

        <span>ภาษาอังกฤษ</span>
      </div>
    ),
  },
];

const navigation = [
  {
    name: "นัดหมายรับสินค้า",
    href: "appoint",
    current: false,
    extarnal: false,
    link: "https://order.fuzepost.co.th/",
  },
  { name: "หน้าแรก", href: "#", current: false },
  // {
  //   name: "ติดตามสถานะพัสดุ",
  //   href: "tracking",
  //   current: false,
  //   extarnal: false,
  //   link: "https://track.fuzepost.co.th/",
  // },
  // { name: `จุดส่งพัสดุ`, href: '#', current: false },
  { name: "บริการ", href: "area", current: false },
  // {
  //   name: "บริการ",
  //   href: "contact",
  //   current: false,
  //   sub_navigation: [
  //     { name: `ส่งสินค้าควบคุมอุณหภูมิ`, href: "parcel", current: false },
  //     { name: `ส่งสินค้าแบบเหมาคัน`, href: "parcel", current: false },
  //     {
  //       name: `Cold Chain Delivery Solution  `,
  //       href: "parcel",
  //       current: false,
  //     },
     
  //   ],
  // },
  // { name: 'ค้นหาจุดให้บริการ', href: 'dropoff', current: false },
  // { name: 'พื้นที่จัดส่ง', href: 'area', current: false },
  // { name: "ข่าวสาร", href: "news", current: false },
  // {
  //     name: 'บริการของเรา', href: 'service', current: false,
  //     // sub_navigation:
  //     //     [
  //     //         { name: `บริการรับส่งสินค้า แช่เย็น/แช่แข็ง`, href: 'service', current: false },
  //     //         // { name: 'บริการรับส่งดอกไม้', href: 'service/flower', current: false },
  //     //         // { name: 'ส่งสินค้าพัสดุทั่วไป', href: '#', current: false },
  //     //     ]
  // },
  { name: "เกี่ยวกับเรา", href: "about", current: false },
   { name: `ติดต่อเรา`, href: "contact", current: false },
    { name: `คำถามที่พบบ่อย`, href: "faq", current: false },
  // {
  //   name: "ติดต่อเรา",
  //   href: "contact",
  //   current: false,
  //   sub_navigation: [
  //     { name: `ติดต่อเรา`, href: "contact", current: false },
  //     { name: `คำถามที่พบบ่อย`, href: "faq", current: false },
     
  //   ],
  // },
  { name: "ออกจากระบบ", href: "signout", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-6 h-6 text-blue-600">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.314h3.59l-.467 3.622h-3.123V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
  </svg>
);

const LineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-6 h-6 text-green-500">
    <path d="M19.665 3.186C17.458 1.794 14.478 1 12.007 1h-.012C6.261 1 .945 4.88.945 9.95c0 2.679 1.512 5.093 3.926 6.743v3.643a.662.662 0 0 0 .658.662c.107 0 .215-.028.312-.082l3.649-2.04a15.16 15.16 0 0 0 2.506.203c5.746 0 11.062-3.88 11.062-8.949 0-2.559-1.412-4.969-3.393-6.284zM7.41 10.998H5.9V7.65h1.51v3.348zm3.3 0H9.198V8.57H7.942V7.65h3.77v.92h-1.257v2.428zm3.374 0h-1.51V7.65h1.51v3.348zm3.855 0-1.033-1.525-1.033 1.525h-1.715l1.793-2.543-1.68-2.49h1.691l.96 1.437.96-1.437h1.664l-1.675 2.49 1.776 2.543h-1.708z" />
  </svg>
);

export default function Header() {
  const [isNotification, setisNotification] = useState(false);
  const { asPath } = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [notifications, setnotifications] = useState([]);
  const signOutFunction = async () => {
    dispatch({
      type: "clear_all",
    });
    await removeLocalStorage("token");
    try {
      router.push("/login");
      // const data = await signOut({ redirect: false, callbackUrl: `/login` })
      // setTimeout(() => {
      //     router.push(data.url)
      // }, 200);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (userState?.username) {
      getNotification();
    }
  }, [userState]);

  const getNotification = async () => {
    try {
      const result = await ApiUsers.getNotification();
      if (result.status == 200) {
        const { notification } = result.data;
        setnotifications(notification);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="header-1 fixed z-[300]">
        <div className="sm:flex items-center hidden sm:justify-start flex-1">
       
          <div className="flex items-center ml-3 pl-2">
            {/* <Select
              options={options}
              defaultValue={options[0]}
              className=" z-[400]"
              classNamePrefix="react-select"
              isSearchable={false}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "30px", // ลดความสูงของ dropdown
                  fontSize: "12px", // ลดขนาดตัวอักษร
                  zIndex: 499, // เพิ่ม z-index ให้สูงขึ้น
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px", // ลด padding ภายใน
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "4px", // ลดขนาด dropdown indicator
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "12px", // ลดขนาดตัวอักษรในตัวเลือก
                  color: state.isSelected ? "white" : "black", // สีตัวอักษร
                  backgroundColor: state.isSelected ? "#1877F2" : "white", // สีพื้นหลัง
                  ":hover": {
                    backgroundColor: "#f0f0f0", // สีพื้นหลังเมื่อ hover
                  },
                }),
                menu: (base) => ({
                  ...base,
                  position: "absolute",
                  zIndex: 399, // เพิ่ม z-index ให้ dropdown
                }),
              }}
            /> */}
          </div>
        </div>
        <div className="flex w-full sm:w-auto justify-end items-center">
          <div className="hidden sm:flex">
            <SocialButtons />
          </div>

          <button className="flex items-center text-right rounded-l-full rounded-r-full bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 ml-2">
            <PhoneIcon className="w-4 h-4 mr-2" />
            Call 064-5420333
          </button>

          {/* <div className='flex items-center ml-10 pl-2'>
                        <span>ไทย</span>
                    </div>
                    <div className='flex items-center border-l-2 ml-2 pl-2'>
                        <span>EN</span>
                    </div> */}
        </div>
      </div>
      <Disclosure
        as="nav"
        className={`bg-white shadow-lg fixed z-[299] w-full top-14 ${
          isNotification && "!z-[10]"
        }`}>
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 whitespace-nowrap ">
              <div className="relative flex items-center justify-between py-2">
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start flex-wrap">
                  <div className="flex-shrink-0 flex items-center relative">
                    <Link href={"/"}>
                      <img
                        className="block lg:hidden h-10 w-auto cursor-pointer"
                        src={"/assets/images/farm/logo.jpg"}
                        alt="Logo"
                      />
                    </Link>
                    <Link href={"/"}>
                      <img
                        className="hidden lg:block h-10 w-auto cursor-pointer"
                        src={"/assets/images/farm/logo.jpg"}
                        alt="Logo"
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:flex flex-1 items-center justify-center">
                    <div className="flex space-x-4 flex-wrap ml-10 items-center">
                      {navigation
                        .filter(
                          (x) =>
                            x.href != "appoint" ||
                            (x.href == "appoint" && userState.id)
                        )
                        .map((item) => {
                          if (item.extarnal == true) {
                            return (
                              <a
                                target={"_blank"}
                                rel="noreferrer"
                                key={item.name}
                                href={item.link}
                                className={classNames(
                                  (
                                    asPath == "/"
                                      ? item.current
                                      : asPath.includes(item.href) &&
                                        item.href != ""
                                  )
                                    ? "bg-green-600 text-white"
                                    : "text-black hover:bg-green-50 hover:text-black",
                                  "px-3 py-2 rounded-md text-sm font-bold"
                                )}
                                aria-current={
                                  (
                                    asPath == "/"
                                      ? item.current
                                      : asPath.includes(item.href) &&
                                        item.href != ""
                                  )
                                    ? "page"
                                    : undefined
                                }>
                                {item.name}
                              </a>
                            );
                          }
                          if (item.href == "signout") {
                            return <></>;
                          }
                          if (item?.sub_navigation?.length > 0) {
                            return (
                              <Menu
                                key={item.name}
                                as="div"
                                className="relative inline-block text-left">
                                <div>
                                  <Menu.Button className="dropdown-header">
                                    {item.name}
                                    <ChevronDownIcon
                                      className="w-5 h-5 ml-2 -mr-1 text-blue-secondary"
                                      aria-hidden="true"
                                    />
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95">
                                  <Menu.Items className="absolute left-2 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1">
                                      {item?.sub_navigation.map((subitem) => {
                                        return (
                                          <Menu.Item key={subitem.name}>
                                            {({ active }) => (
                                              <Link
                                                key={subitem.name}
                                                href={`/${subitem.href}`}>
                                                <button
                                                  className={`${
                                                    active
                                                      ? "bg-blue-secondary text-white"
                                                      : "text-gray-900"
                                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                                  {subitem.name}
                                                </button>
                                              </Link>
                                            )}
                                          </Menu.Item>
                                        );
                                      })}
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            );
                          }

                          return (
                            <Link key={item.name} href={`/${item.href}`}>
                              <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  (
                                    asPath == "/"
                                      ? item.current
                                      : asPath.includes(item.href) &&
                                        item.href != ""
                                  )
                                    ? "text-green-600 text-base font-extrabold"
                                    : "text-black hover:bg-green-50 hover:text-black",
                                  "px-3 py-2 rounded-md text-sm font-bord"
                                )}
                                aria-current={
                                  (
                                    asPath == "/"
                                      ? item.current
                                      : asPath.includes(item.href) &&
                                        item.href != ""
                                  )
                                    ? "page"
                                    : undefined
                                }>
                                {item.name}
                              </a>
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                  <div className="hidden sm:flex  w-full sm:w-auto justify-end">
                    {userState.id ? (
                      <div className="flex gap-x-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <BellIcon
                              onClick={() => {
                                setisNotification(!isNotification);
                              }}
                              className="block h-6 w-6 cursor-pointer"
                              aria-hidden="true"
                            />
                            <div className="bg-red-500 h-2 w-2 absolute top-0 right-0 rounded-[100%]"></div>
                            {isNotification && (
                              <div className="px-5 pt-4 pb-2 bg-white absolute border shadow-lg z-[999] right-0 top-8 rounded-lg flex flex-col divide-y">
                                {notifications.length > 0 ? (
                                  notifications.map((item, index) => {
                                    return (
                                      <div
                                        key={"notification" + index}
                                        className="flex pb-2 gap-x-4 items-center min-w-[200px]">
                                        {/* <div className='w-8 h-8 bg-red-200 rounded-full'>
                                                    </div> */}
                                        <div className="flex flex-col flex-1">
                                          <label className="font-regular whitespace-nowrap text-black-text">
                                            {item.title}
                                          </label>
                                          <label className="text-sm whitespace-nowrap text-black-text">
                                            {item.description}
                                          </label>
                                        </div>
                                        <div className="text-black-text whitespace-nowrap flex flex-col justify-end items-end">
                                          <small>
                                            {ConvertDateShortThai(
                                              item.createdate,
                                              "DD MMM YY"
                                            )}
                                          </small>
                                          <small>
                                            {ConvertDateShortThai(
                                              item.createdate,
                                              "HH:mm"
                                            )}
                                          </small>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="flex pb-2 gap-x-4 items-center justify-center min-w-[100px]">
                                    <small className="text-black-text">
                                      ยังไม่มีแจ้งเตือน
                                    </small>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Link href={"/profile"}>
                            <span className="cursor-pointer">
                              {userState.name}
                            </span>
                          </Link>
                        </div>
                        <button
                          onClick={signOutFunction}
                          className="hidden sm:flex items-center">
                          <span className="cursor-pointer">ออกจากระบบ</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* <div className="flex items-center">
                          <Link href={"/login"}>
                            <span className="cursor-pointer">เข้าสู่ระบบ</span>
                          </Link>
                        </div>
                        <div className="flex items-center ml-2 pl-2">
                          <Link href={"/register"}>
                            <button className="text-right  bg-blue-primary text-white px-4 py-2 rounded-lg hover:bg-blue-primary">
                              ลงทะเบียน
                            </button>
                       
                          </Link>
                        </div> */}
                      </>
                    )}

                    {/* <div className='flex items-center ml-10 pl-2'>
                        <span>ไทย</span>
                    </div>
                    <div className='flex items-center border-l-2 ml-2 pl-2'>
                        <span>EN</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="flex w-full">
           
                {/* <div className="flex-[1]">
                  <div className="flex items-center ml-3 pl-2 my-2">
                    <Select
                      options={options}
                      defaultValue={options[0]}
                      classNamePrefix="react-select"
                      isSearchable={false}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "30px", // ลดความสูงของ dropdown
                          fontSize: "12px", // ลดขนาดตัวอักษร
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 8px", // ลด padding ภายใน
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: "4px", // ลดขนาด dropdown indicator
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: "12px", // ลดขนาดตัวอักษรในตัวเลือก
                          color: state.isSelected ? "white" : "black", // สีตัวอักษร
                          backgroundColor: state.isSelected
                            ? "#1877F2"
                            : "white", // สีพื้นหลัง
                          ":hover": {
                            backgroundColor: "#f0f0f0", // สีพื้นหลังเมื่อ hover
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          position: "absolute",
                        }),
                      }}
                    />
                  </div>
                </div> */}

                {/* ส่วนที่ 2 (2 ส่วน) */}
                <div className="flex-[1.5] ">
                  <div className="flex w-full sm:w-auto justify-center items-center mt-2 sm:mt-0 sm:justify-end">
                    {userState.id ? (
                      <div className="flex gap-x-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <BellIcon
                              onClick={() => {
                                setisNotification(!isNotification);
                              }}
                              className="block h-6 w-6 cursor-pointer"
                              aria-hidden="true"
                            />
                            <div className="bg-red-500 h-2 w-2 absolute top-0 right-0 rounded-[100%]"></div>
                            {isNotification && (
                              <div className="px-5 pt-4 pb-2 bg-white absolute border shadow-lg z-[999] right-0 top-8 rounded-lg flex flex-col divide-y">
                                {notifications.length > 0 ? (
                                  notifications.map((item, index) => {
                                    return (
                                      <div
                                        key={"notification" + index}
                                        className="flex pb-2 gap-x-4 items-center min-w-[200px]">
                                      
                                        <div className="flex flex-col flex-1">
                                          <label className="font-regular whitespace-nowrap text-black-text">
                                            {item.title}
                                          </label>
                                          <label className="text-sm whitespace-nowrap text-black-text">
                                            {item.description}
                                          </label>
                                        </div>
                                        <div className="text-black-text whitespace-nowrap flex flex-col justify-end items-end">
                                          <small>
                                            {ConvertDateShortThai(
                                              item.createdate,
                                              "DD MMM YY"
                                            )}
                                          </small>
                                          <small>
                                            {ConvertDateShortThai(
                                              item.createdate,
                                              "HH:mm"
                                            )}
                                          </small>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="flex pb-2 gap-x-4 items-center justify-center min-w-[100px]">
                                    <small className="text-black-text">
                                      ยังไม่มีแจ้งเตือน
                                    </small>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Link href={"/profile"}>
                            <span className="cursor-pointer">
                              {userState.name}
                            </span>
                          </Link>
                        </div>
                        <button
                          onClick={signOutFunction}
                          className="hidden sm:flex items-center">
                          <span className="cursor-pointer">ออกจากระบบ</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* <div className="flex items-center">
                          <Link href={"/login"}>
                            <span className="cursor-pointer">เข้าสู่ระบบ</span>
                          </Link>
                        </div>
                        <div className="flex items-center ml-2 pl-2">
                          <Link href={"/register"}>
                            <button className="text-right  bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700">
                              ลงทะเบียน
                            </button>
                           
                          </Link>
                        </div> */}
                      </>
                    )}

                  </div>
                </div>
              </div>

              <div className="px-2  pb-2 space-y-1">
                {navigation
                  .filter(
                    (x) =>
                      x.href != "appoint" ||
                      (x.href == "appoint" && userState.id)
                  )
                  .map((item) => {
                    if (item.extarnal == true) {
                      return (
                        <Disclosure.Button
                          target={"_blank"}
                          rel="noreferrer"
                          key={item.name}
                          as="a"
                          href={item.link}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-black hover:bg-gray-700 hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          {item.name}
                        </Disclosure.Button>
                      );
                    }
                    if (item.href == "signout") {
                      return (
                        userState.id && (
                          <button
                            onClick={signOutFunction}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-black hover:bg-gray-700 hover:text-white",
                              "block px-3 py-2 rounded-md text-base font-medium"
                            )}>
                            {item.name}
                          </button>
                        )
                      );
                    }
                    if (item?.sub_navigation?.length > 0) {
                      return (
                        <Menu
                          key={item.name}
                          as="div"
                          className="relative inline-block text-left">
                          <div>
                            <Menu.Button className="block px-3 py-2 rounded-md text-base font-medium flex items-center justify-center">
                              {item.name}
                              <ChevronDownIcon
                                className="w-5 h-5 ml-2 -mr-1 text-blue-secondary"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="absolute left-2 whitespace-nowrap mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="px-1 py-1">
                                {item?.sub_navigation.map((subitem) => {
                                  return (
                                    <Menu.Item key={subitem.name}>
                                      {({ active }) => (
                                        <Link
                                          key={subitem.name}
                                          href={`/${subitem.href}`}>
                                          <button
                                            className={`${
                                              active
                                                ? "bg-blue-secondary text-white"
                                                : "text-gray-900"
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                            {subitem.name}
                                          </button>
                                        </Link>
                                      )}
                                    </Menu.Item>
                                  );
                                })}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      );
                    }
                    return (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={"/" + item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-black hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}>
                        {item.name}
                      </Disclosure.Button>
                    );
                  })}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
