import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiOrders from "api/ApiOrders";
import { useEffect, useState } from "react";
import { ConvertDateShortThai } from "utils";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import Link from "next/link";

const ClaimDetailPage = ({ id, claims = [] }) => {
    const router = useRouter()
    const [checkSelected, setcheckSelected] = useState([]);
    const [state, setState] = useState({
        claimtype_id: "",
        claim_note: ""
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
        const promise1 = getClaimDetail();
        Promise.all([promise1]).then((result) => {
            toast.dismiss();
        })
    }, []);

    const getClaimDetail = async () => {
        const result = await ApiOrders.historyOrdersClaimDetail(id);
        if (result.status == 200) {
            const { data } = result;
            setorder(data);
        }
    }



    const handleValidation = () => {
        let fields = state;
        let errors = {};
        let formIsValid = true;
        if (!fields["claimtype_id"]) {
            formIsValid = false;
            errors["claimtype_id"] = "กรุณาเลือกเหตุผลในการขอคืนสินค้า";
        }
        setFieldErrors(errors);
        return formIsValid;
    }

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const isValid = await handleValidation();
        if (isValid) {
            if (checkSelected.length == 0) {
                toast.error("กรุณาเลือกรายการขอคืนสินค้า อย่างน้อย 1 รายการ", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
            }
            if (state.image) {
                formData.append('files', state.image);
            }
            formData.append('state', JSON.stringify(
                {
                    ...state,
                    order_id: order.id,
                    cust_id: order.cust_id,
                    number_of_damaged: checkSelected.length,
                    items: checkSelected,
                    order_ref: order.order_code
                }
            ));
            const result = await ApiOrders.cliamOrder(formData, order.order_code);
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

        <TitleMenu imageSrc="/assets/images/claim_menu.webp" title="เคลมสินค้า" description='' />
 
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
                            <label>{ConvertDateShortThai(order.order_createdate, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>
                        <div className="flex justify-between">
                            <label>ชำระเงิน</label>
                            <label>{ConvertDateShortThai(order?.payment?.trade_time, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between p-4 gap-y-4">
                        {
                            order.items && order.items.map((item, index) => {
                                let components = [];
                                for (let i = 0; i < item.qty_amt; i++) {
                                    components.push(<div key={`item-${index}-${i}`} className='flex flex-1 justify-between'>
                                        <div className='flex items-center flex-1'>
                                            <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                            <div className='flex flex-col flex-1'>
                                                <label className="text-xs lg:text-base font-semibold">
                                                    {item.type_name} {`(${item.service_name})`}
                                                </label>
                                                <div className="flex justify-between flex-1">
                                                    <label className="text-xs lg:text-base">
                                                        Size : {item.size_name} &nbsp;&nbsp;
                                                    </label>
                                                    <label className="text-xs lg:text-base font-regular">
                                                        {item.price_amt} บาท
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                }
                                return components;
                            })
                        }
                    </div>
                </div>
                <div className="flex gap-y-2 flex-col">
                    <label className="fond-regular">เหตุผลในการขอเคลมสินค้า</label>
                    <SelectComponent
                        errors={fieldErrors}
                        disabled
                        name="claimtype_id"
                        label={"กรุณาเลือก"}
                        value={order.claimtype_id ?? ""}
                        onChange={(e) => {
                            setState({ ...state, claimtype_id: e?.value ?? "" })
                        }}
                        required
                        options={claims.map((x) => ({ value: x.id, label: x.claim }))} />
                </div>
                <div className="flex gap-y-2 flex-col">
                    <label className="fond-regular">คำอธิบายเพิ่มเติมเหตุผลที่คุณเลือก</label>
                    <InputComponent
                        isInput={false}
                        name="claim_note"
                        disabled

                        rows={2}
                        //label="ที่อยู่"
                        placeholder={""}
                        onChange={(e) => setState({ ...state, claim_note: e.target.value })}
                        value={order.claim_note ?? ""}
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
    const resultClaim = await ApiMasters.getClaim();
    return {
        props: {
            id: id,
            claims: resultClaim.data,
        },
    }
}

export default ClaimDetailPage;