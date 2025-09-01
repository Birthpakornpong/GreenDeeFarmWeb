import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import ApiOrders from "api/ApiOrders";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
const Tracking = () => {
    const router = useRouter();
    const [trackingNo, settrackingNo] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await ApiOrders.findTracking(trackingNo);
            if (result.status == 200) {
                router.push(`/tracking/${trackingNo}`)
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

    return <div>
        <Toaster
            reverseOrder={false}
        />
        <Head>
            <title>Tracking</title>
            <meta name="description" content="Tracking page - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <TitleMenu title={"เช็คสถานะพัสดุ"}
                imageSrc="/assets/images/trackingTitle.webp"
                description="สามารถติดตามพัสดุได้โดยการกรอก Order ID, Tracking No. อย่างใดอย่างหนึ่ง"
            />
        <div className="container mx-auto mt-7 sm:mt-10">
            <form onSubmit={onSubmit} className="w-full flex flex-wrap" style={{ marginTop: '-0.75rem' }}>
                <div className="grid grid-cols-1 gap-4 sm:flex w-full flex-wrap ">
                    <div className="flex-1 mx-2 relative">
                        <InputComponent
                            key="trackingNo"
                            label="Order ID / Tracking No."
                            placeholder={"Order ID / Tracking No."}
                            onChange={(e) => settrackingNo(e.target.value)}
                            value={trackingNo}
                            required
                        />

                    </div>
                    <button className="px-16 py-3 bg-blue-primary rounded-md text-white mx-2">ยืนยัน</button>
                </div>
            </form>
        </div>
    </div>
}

export default Tracking;