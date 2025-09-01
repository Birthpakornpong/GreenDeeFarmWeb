import ApiUsers from 'api/ApiUsers';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Edit = () => {
    const [profile, setprofile] = useState({
        addresses: [],

    });
    const userState = useSelector(state => state.user);
    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        const result = await ApiUsers.getUserProfile();
        if (result.status == 200) {
            setprofile(result.data.userData);
        }
    }

    return (
        <div>
            <div className="flex items-center h-20 lg:h-28 ml-5 lg:ml-24 pr-5 lg:pr-24 bg-gradient-to-r from-blue-secondary to-blue-neon rounded-tl-100 gap-3">
                <div className='flex'>
                    <img className="ml-3 lg:ml-7 -mb-20 lg:mt-5 h-20 lg:h-24 border-8 border-white bg-white rounded-full" src="/assets/icons/smile.svg" />
                    <div className="flex flex-col -mb-7 lg:mt-7 ml-3">
                        <label className="text-white lg:text-md">ยินดีต้อนรับ</label>
                        <label className="text-blue-primary text-lg lg:text-xl font-bold">{userState.name}</label>
                    </div>
                </div>
            </div>
            <div className='px-5 lg:px-24 pt-10'>

                <div className='flex gap-3 items-center'>
                    <img className="h-5 lg:h-10" src="/assets/icons/cog-blue.svg" />
                    <label className="text-blue-primary text-lg lg:text-xl font-semibold">จัดการบัญชี</label>
                </div>

            </div>
            <div className='px-5 lg:px-24 py-5'>
                <div className='border-2 rounded-lg p-3 lg:p-5'>
                    <div className='flex justify-between'>
                        <label className=' text-blue-primary lg:text-lg font-bold'>ข้อมูลส่วนตัว</label>
                        <Link href={`/profile/${userState.username}`}>
                            <div className='flex items-center'>
                                <img className="h-4 lg:h-6" src="/assets/icons/pencil.svg" />
                                <label className="text-blue-primary text-sm lg:text-base underline italic cursor-pointer">แก้ไข</label>
                            </div>
                        </Link>
                    </div>
                    <div className='text-sm font-semibold pt-3'>
                        <div className="">{userState.name}</div>
                        <div className="">Tel : {userState.mobile}</div>
                        <div className="">Email : {userState.email}</div>
                    </div>
                </div>
                <div className='border-2 rounded-lg py-3 lg:py-5 mt-5'>
                    <div className='px-3 lg:px-5'>
                        <label className='text-blue-primary lg:text-lg font-bold'>ที่อยู่ที่ส่งสินค้า</label>
                    </div>
                    {
                        profile.addresses.filter(x => x.type == "S").map((item, index) => {
                            return <div key={item.id}>
                                <div className='flex justify-between p-3 lg:px-5'>
                                    <div className='flex gap-3 lg:gap-5'>
                                        <img className="h-8 lg:h-10" src="/assets/images/location.webp" />
                                        <div className='flex flex-col lg:gap-3'>
                                            <div className='flex gap-3 lg:gap-5'>
                                                <label className="text-xs lg:text-sm font-semibold">{item.name}</label>
                                                <label className="text-gray-text text-xs lg:text-sm font-semibold">Tel : {item.phone}</label>
                                            </div>
                                            <label className="text-xs lg:text-sm w-56 sm:w-auto">{`${item.address} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</label>
                                            {
                                                item.is_default && <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xss lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>
                                            }

                                        </div>
                                    </div>
                                    <Link href={`/profile/editAddress/${item.id}`}>
                                        <div className='flex cursor-pointer'>
                                            <img className="h-4 lg:h-6" src="/assets/icons/pencil.svg" />
                                            <label className="text-blue-primary text-sm lg:text-base underline italic cursor-pointer">แก้ไข</label>
                                        </div>
                                    </Link>
                                </div>
                                <hr className='border' />
                            </div>
                        })
                    }
                    <Link href="/profile/addAddress">
                        <button className='bg-blue-secondary rounded-full text-white text-sm  lg:text-base font-semibold px-3 py-1 mx-3 lg:mx-5 mt-3 lg:mt-5' >เพิ่มที่อยู่ใหม่</button>
                    </Link>
                </div>
                <div className='border-2 rounded-lg py-3 lg:py-5 mt-5'>
                    <div className='px-3 lg:px-5'>
                        <label className='text-blue-primary lg:text-lg font-bold'>ที่อยู่ที่รับสินค้า</label>
                    </div>
                    {
                        profile.addresses.filter(x => x.type == "R").map((item, index) => {
                            return <div key={item.id}>
                                <div className='flex justify-between p-3 lg:px-5'>
                                    <div className='flex gap-3 lg:gap-5'>
                                        <img className="h-8 lg:h-10" src="/assets/images/location.webp" />
                                        <div className='flex flex-col lg:gap-3'>
                                            <div className='flex gap-3 lg:gap-5'>
                                                <label className="text-xs lg:text-sm font-semibold">{item.name}</label>
                                                <label className="text-gray-text text-xs lg:text-sm font-semibold">Tel : {item.phone}</label>
                                            </div>
                                            <label className="text-xs lg:text-sm w-56 sm:w-auto">{`${item.address} ${item.subdistrict} ${item.district} ${item.province} ${item.zipcode}`}</label>
                                            {
                                                item.is_default && <button className='border border-red-default rounded-lg w-40 lg:w-52 text-xss lg:text-sm text-orange-default px-3 my-2'>ที่อยู่เริ่มต้นสำหรับส่งสินค้า</button>
                                            }
                                        </div>
                                    </div>
                                    <Link href={`/profile/editAddress/${item.id}`}>
                                        <div className='flex cursor-pointer'>
                                            <img className="h-4 lg:h-6" src="/assets/icons/pencil.svg" />
                                            <label className="text-blue-primary text-sm lg:text-base underline italic cursor-pointer">แก้ไข</label>
                                        </div>
                                    </Link>
                                </div>
                                <hr className='border' />
                            </div>
                        })
                    }
                    <Link href="/profile/addAddressReceive">
                        <button className='bg-blue-secondary rounded-full text-white text-sm  lg:text-base font-semibold px-3 py-1 mx-3 lg:mx-5 mt-3 lg:mt-5' >เพิ่มที่อยู่ใหม่</button>
                    </Link>
                </div>
                <div className='border-2 rounded-lg p-3 lg:p-5 mt-5'>
                    <div className='flex justify-between'>
                        <label className=' text-blue-primary lg:text-lg font-bold'>รหัสผ่าน</label>
                        <div className='flex'>
                            <img className="h-4 lg:h-6" src="/assets/icons/pencil.svg" />
                            <Link href="/profile/changePassword">
                                <label className="text-blue-primary text-sm lg:text-base underline italic cursor-pointer">แก้ไข</label>
                            </Link>
                        </div>
                    </div>
                    <div className='text-sm lg:text-base font-semibold pt-3'>
                        <div className="">********</div>
                    </div>
                </div>
                {/* <button className='hidden lg:flex text-gray-text text-lg font-semibold bg-gray-light rounded-lg px-5 py-3 my-5'>
                    <img className="h-4 lg:h-6 mr-2" src="/assets/icons/user-times.svg" />
                    ยกเลิกการเป็นสมาชิก
                </button> */}
            </div>
        </div>
    );
};

export async function getServerSideProps({ params }) {
    // const result = await ApiUsers.getUserProfile();
    return {
        props: {
            profile: {},
        }
    }
}

export default Edit;
