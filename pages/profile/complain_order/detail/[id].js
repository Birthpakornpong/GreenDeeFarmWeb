import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiOrders from "api/ApiOrders";
import { useEffect, useState } from "react";
import { ConvertDateShortThai, CurrencyThai } from "utils";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import Link from "next/link";

const ComplainOrder = ({ id, complains = [] }) => {
    const router = useRouter()
    const [checkSelected, setcheckSelected] = useState([]);
    const [state, setState] = useState({
        complaintype_id: "",
        complain_note: ""
    });

    const [fieldErrors, setFieldErrors] = useState({

    });

    const [order, setorder] = useState({});

    useEffect(() => {
        toast.loading('กรุณารอสักครู่', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        const promise1 = getComplainDetail();
        Promise.all([promise1]).then((result) => {
            toast.dismiss();
        })
    }, []);

    const getComplainDetail = async () => {
        const result = await ApiOrders.historyOrdersComplainDetail(id);
        if (result.status == 200) {
            const { data } = result;
            setorder(data);
        }
    }

    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["complaintype_id"]) {
            formIsValid = false;
            errors["complaintype_id"] = "กรุณาเลือกเหตุผลในการขอคืนสินค้า";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidation();
        if (isValid) {
            if (state.image) {
                formData.append('files', state.image);
            }
            formData.append('state', JSON.stringify(
                {
                    ...state,
                    order_id: order.id,
                    cust_id: order.cust_id,
                    order_ref: order.order_code
                }
            ));
            const result = await ApiOrders.complainOrder(formData, order.order_code);
            toast.dismiss();
            const { status } = result;
            if (status == 200) {
                toast.success('บันทึกสำเร็จ!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 2000
                })
                const successTimeout = setTimeout(() => router.push('/profile'), 2000)
                return () => clearTimeout(successTimeout)
            }
        }

    }

    return <div>

<TitleMenu imageSrc="/assets/images/claim_menu.webp" title="ร้องเรียน" description='' />
     
        {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
        <div className="container mx-auto px-4 mt-7 gap-y-4 flex flex-col">
            <form className="gap-y-4 flex flex-col" onSubmit={submit}>
                <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-4 flex-wrap">
                        <h4>เลขที่ Order : {order.order_code}</h4>
                        <label className="text-blue-primary italic">{`ต้นทาง ${order.sender_province} ปลายทาง ${order.recv_province}`}</label>
                    </div>
                    <div className="flex flex-col p-4 gap-y-2">
                        <div className="flex justify-between">
                            <label>ทำการสั่งซื้อ</label>
                            <label>{ConvertDateShortThai(order.order_create, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>
                        <div className="flex justify-between">
                            <label>ชำระเงิน</label>
                            <label>{ConvertDateShortThai(order?.payment?.trade_time, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>
                    </div>
                    <div className='flex flex-col items-end p-4'>
                        <div className='flex items-end'>
                            <label className='text-xs lg:text-base font-regular'>รวมทั้งสิ้น ({order.box_amt} กล่อง)&nbsp; : &nbsp;</label>
                            <label className='font-regular lg:text-lg'>{CurrencyThai(parseFloat(order.order_price_amt) - parseFloat(order.insurance_amt) + parseFloat(order.discount_amt))} บาท</label>
                        </div>
                        {
                            order.insurance_amt && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>ค่าประกันความเสียหาย &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.insurance_amt)} บาท</label>
                            </div>
                        }
                        {
                            order.discount_amt && <div className='flex items-end'>
                                <label className='text-xs lg:text-base font-regular'>ส่วนลดทั้งหมด &nbsp; : &nbsp;</label>
                                <label className='font-regular lg:text-lg'>{CurrencyThai(order.discount_amt)} บาท</label>
                            </div>
                        }
                        <div className='flex items-end'>
                            <label className='text-xs lg:text-base font-semibold'>ราคาสุทธิ &nbsp; : &nbsp;</label>
                            <label className='font-semibold lg:text-lg'>{CurrencyThai(order.order_price_amt)} บาท</label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-y-2 flex-col">
                    <label className="fond-regular">หัวข้อในการร้องเรียน <label className="text-red-500">*</label></label>
                    <SelectComponent
                        errors={fieldErrors}
                        name="complaintype_id"
                        label={"กรุณาเลือก"}
                        disabled
                        value={order.complaintype_id ?? ""}
                        onChange={(e) => {
                            setState({ ...state, complaintype_id: e?.value ?? "" })
                        }}
                        required
                        options={complains.map((x) => ({ value: x.id, label: x.complain }))} />
                </div>
                <div className="flex gap-y-2 flex-col">
                    <label className="fond-regular">คำอธิบายเพิ่มเติมเหตุผลที่คุณเลือก</label>
                    <InputComponent
                        isInput={false}
                        disabled
                        name="complain_note"
                        rows={2}
                        //label="ที่อยู่"
                        placeholder={""}
                        onChange={(e) => setState({ ...state, complain_note: e.target.value })}
                        value={order.complain_note ?? ""}
                    //errors={fieldErrors}
                    //required
                    />
                </div>
                <div className="flex flex-wrap flex-row gap-x-4">
                    {
                        order.files && order.files.map((item, index) => {
                            return <img key={`image-${index}`} className={`w-40 h-40 border`}
                                src={process.env.IMAGE_FRONTEND_URL + item.path} />
                        })
                    }
                </div>
                <Link href={`/profile`}>
                    <button type="button" className="px-16 mt-5 py-3 bg-blue-primary w-64 rounded-md text-white mt-3">
                        กลับ
                    </button>
                </Link>
            </form>
            <Toaster
                reverseOrder={false}
            />
        </div>
    </div>
}


export async function getServerSideProps(params) {
    const id = params.query.id;
    const resultClaim = await ApiMasters.getComplainOrder();
    return {
        props: {
            id: id,
            complains: resultClaim.data,
        },
    }
}

export default ComplainOrder;