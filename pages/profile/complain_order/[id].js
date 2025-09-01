import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiOrders from "api/ApiOrders";
import { useState } from "react";
import { CheckFile, ConvertDateShortThai, CurrencyThai } from "utils";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";

const ComplainOrder = ({ id, order, complains = [] }) => {
    const router = useRouter()
    const [checkSelected, setcheckSelected] = useState([]);
    const [state, setState] = useState({
        complaintype_id: "",
        complain_note: ""
    });
    const [files, setFiles] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({

    });

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
            if (files.length == 0) {
                toast.error("กรุณาอัพโหลดไฟล์อย่างน้อย 1 ไฟล์", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    className: "text-lg"
                })
                return false;
            }
            if (files) {
                //formData.append('files', state.image);
                files.forEach(file => {
                    formData.append('files', file)
                });
            }
            formData.append('state', JSON.stringify(
                {
                    ...state,
                    order_id: order.id,
                    cust_id: order.cust_id,
                    order_ref: order.order_code
                }
            ));
            toast.loading('กรุณารอสักครู่', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            setisLoading(true);
            try {
                const result = await ApiOrders.complainOrder(formData, order.order_code);
                setisLoading(false);
                const { status } = result;
                if (status == 200) {
                    toast.dismiss();
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
            } catch (error) {
                toast.dismiss();
                setisLoading(false);
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

    return <div>

<TitleMenu imageSrc="/assets/images/claim_menu.webp" title="ร้องเรียน" description='' />
      
        {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
        <div className="container mx-auto px-4 mt-7 gap-y-4 flex flex-col">
            <form className="gap-y-4 flex flex-col" onSubmit={submit}>
                <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-4 flex-wrap">
                        <h4>เลขที่ Order : {id}</h4>
                        <label className="text-blue-primary italic">{`ต้นทาง ${order.sender_province}`}</label>
                    </div>
                    <div className="flex flex-col p-4 gap-y-2">
                        <div className="flex justify-between">
                            <label>ทำการสั่งซื้อ</label>
                            <label>{ConvertDateShortThai(order.createdate, "วันที่ DD MMM YY HH:ss น.")}</label>
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
                        value={state.complaintype_id}
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
                        name="complain_note"
                        rows={2}
                        //label="ที่อยู่"
                        placeholder={""}
                        onChange={(e) => setState({ ...state, complain_note: e.target.value })}
                        value={state.complain_note}
                    //errors={fieldErrors}
                    //required
                    />
                </div>
                <>
                    <div className="flex flex-col w-40">
                        <span></span>
                        <label htmlFor={`image_claim`} className="border-dotted border p-4 flex items-center border-[#15466e] rounded bg-[#f9fafc] text-sm flex-col cursor-pointer">
                            <div className="flex gap-x-2">
                                <span className="text-center">{state.image?.name ?? "อัพโหลดรูปภาพ"}</span>
                            </div>
                            <input id={`image_claim`} multiple accept="image/*" type="file" name="files"
                                // multiple 
                                // accept="image/png, image/jpeg"
                                className="hidden" onChange={(e) => {
                                    if (e.target.files[0]) {
                                        let messages = [];
                                        Array.from(e.target.files).map((item, index) => {
                                            let message = CheckFile({
                                                file: item,
                                                size: 1,
                                                type: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
                                                message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น",
                                            });
                                            if (message) {
                                                messages.push(message);
                                            }
                                        })
                                        if (messages.length > 0) {
                                            toast.error(messages[0], {
                                                style: {
                                                    borderRadius: '10px',
                                                    background: '#333',
                                                    color: '#fff',
                                                },
                                                className: "text-lg"
                                            })
                                        } else {
                                            setFiles([...files, ...e.target.files])
                                        }
                                    }
                                }} />
                        </label>
                    </div>
                    <span className="text-sm text-gray-400">(แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 1 Mb.)</span>
                    <div className="flex gap-x-2">
                        {
                            files.length > 0 &&
                            files.map((file, index) => {
                                const url = URL.createObjectURL(file);
                                return (
                                    <div className="" key={index}>
                                        {/* <label htmlFor="dropzone-file-suggest" className="flex flex-col justify-center items-center w-full h-full"> */}
                                        <img src={url} alt={file.name} className="object-contain h-40 w-52" />
                                        {/* </label> */}
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
                <button disabled={isLoading} className="px-16 mt-5 py-3 bg-blue-primary w-64 rounded-md text-white mt-3">
                    ยืนยัน
                </button>
            </form>
            <Toaster
                reverseOrder={false}
            />
        </div>
    </div>
}


export async function getServerSideProps(params) {
    const id = params.query.id;
    const result = await ApiOrders.findOrder(params.query.id);
    const resultClaim = await ApiMasters.getComplainOrder();
    return {
        props: {
            id: id,
            order: result.data,
            complains: resultClaim.data,
        },
    }
}

export default ComplainOrder;