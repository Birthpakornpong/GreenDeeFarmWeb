import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import SelectComponent from "@components/Select";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiOrders from "api/ApiOrders";
import { useState } from "react";
import { CheckFile, ConvertDateShortThai } from "utils";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import ApiUsers from "api/ApiUsers";
import { useSelector } from "react-redux";
import path from 'path';
import { v4 } from 'uuid';
const ClaimPage = ({ id, order, claims = [] }) => {
    const router = useRouter()
    const [files, setFiles] = useState([]);
    const [checkSelected, setcheckSelected] = useState([]);
    const [state, setState] = useState({
        claimtype_id: "",
        claim_note: "",
        image: [],
        imageDoc5: [],
        imageDoc6: []
    });
    const userState = useSelector(state => state.user);

    const [filesRequired, setFilesRequired] = useState([
        {
            doc_type: userState.customer_type == "normal" ? `เอกสารสำเนาบัตรประชาชน` : `เอกสารหนังสือรับรองบริษัท`,
            doc_type_code: `doc_1`,
            customer_type: "normal",
            condition_text: "แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.",
            condition_files: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            condition_message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น"
        },
        {
            doc_type: `สำเนาบัญชีธนาคาร (ชื่อต้องตรงกับข้อที่ 1)`,
            doc_type_code: `doc_2`,
            customer_type: "normal",
            condition_text: "แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.",
            condition_files: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            condition_message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น"
        },
        {
            doc_type: `กรณีนิติบุคคล หนังสือมูลค่าเพิ่ม (ภพ.20)`,
            doc_type_code: `doc_3`,
            customer_type: "business",
            condition_text: "แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.",
            condition_files: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            condition_message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น"
        },
        {
            doc_type: `เอกสารแสดงมูลค่าสินค้าที่เสียหาย (สลิปโอนเงิน,Invoice)`,
            doc_type_code: `doc_4`,
            customer_type: "normal",
            condition_text: "แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.",
            condition_files: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            condition_message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น"
        }, {
            doc_type: `เอกสารอื่นๆ เช่น กรณีสินค้าเสียหายให้แนบภาพประกอบ`,
            doc_type_code: `doc_5`,
            customer_type: "normal",
            condition_text: "แนบไฟล์ .pdf, .png, .jpeg ขนาดไม่เกิน 2/Mb.",
            condition_files: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            condition_message: "รองรับเฉพาะไฟล์ .png .jpg .jpeg และ .pdf เท่านั้น"
        },
        {
            doc_type: `วิดีโอภาพความเสียหาย`,
            doc_type_code: `doc_6`,
            customer_type: "normal",
            condition_text: "แนบไฟล์ .mp4, .mov, .avi ขนาดไม่เกิน 20/Mb.",
            condition_size: 20,
            condition_files: ["video/mp4", "video/quicktime", "	video/x-msvideo"],
            condition_message: "รองรับเฉพาะไฟล์ .mp4 .mov และ .avi เท่านั้น"
        }
    ]);
    const [isLoading, setisLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({

    });

    const [orderState, setorderState] = useState(order);




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
                return false;
            }
            var isValidFiles = "";

            filesRequired.filter(x => x.customer_type == "normal" || (userState.customer_type == "business" && x.customer_type == "business")).map((item, index) => {
                if (item.doc_type_code == "doc_5") {
                    if (!state["doc_5_1"]) {
                        isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                    }
                    state.imageDoc5.map((subitem, subindex) => {

                        formData.append('files', state[item.doc_type_code + "_" + (parseInt(subindex) + 1)]);
                    })

                } else if (item.doc_type_code == "doc_6") {
                    // if (!state["doc_6_1"]) {
                    //     isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                    // }
                    if (state.imageDoc6) {
                        state.imageDoc6.map((subitem, subindex) => {
                            formData.append('files', state[item.doc_type_code + "_" + (parseInt(subindex) + 1)]);
                        })
                    }
                } else {
                    if (!state[item.doc_type_code]) {
                        isValidFiles = "กรุณาอัพโหลดไฟล์ให้ครบถ้วน"
                    }
                    formData.append('files', state[item.doc_type_code]);
                }
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
            checkSelected.map((item, index) => {
                item.estimate_value = orderState.items.find(x => x.id == item.item_id)?.estimate_value ?? 0;
            })
            formData.append('state', JSON.stringify(
                {
                    ...state,
                    order_id: orderState.id,
                    cust_id: orderState.cust_id,
                    number_of_damaged: checkSelected.length,
                    items: checkSelected,
                    order_ref: orderState.order_code
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
                // console.log(formData)
                const result = await ApiOrders.cliamOrder(formData, orderState.order_code);
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

        <div className="ml-5 lg:ml-24">
            <TitleMenu imageSrc="/assets/images/claim_menu.webp" title="ขอเคลมสินค้า" description='' />
        </div>
        {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
        <div className="container mx-auto px-4 mt-7 gap-y-4 flex flex-col">
            <form className="gap-y-4 flex flex-col" onSubmit={submit}>
                <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-4 flex-wrap">
                        <h4>เลขที่ Order : {id}</h4>
                        <label className="text-blue-primary italic">{`ต้นทาง ${orderState.sender_province}`}</label>
                    </div>
                    <div className="flex flex-col p-4 gap-y-2">
                        <div className="flex justify-between">
                            <label>ทำการสั่งซื้อ</label>
                            <label>{ConvertDateShortThai(orderState.createdate, "วันที่ DD MMM YY HH:ss น.")}</label>
                        </div>
                        <div className="flex justify-between">
                            <label>ชำระเงิน</label>
                            <label>{orderState?.payment?.trade_time ? ConvertDateShortThai(orderState?.payment?.trade_time, "วันที่ DD MMM YY HH:ss น.") : "-"}</label>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between p-4 gap-y-4">
                        {
                            orderState.items.map((item, index) => {
                                let components = [];
                                for (let i = 0; i < item.qty_amt; i++) {
                                    components.push(<div key={`item-${index}-${i}`} className='flex flex-1 justify-between'>
                                        <div className='flex items-center flex-1'>
                                            <div className="flex items-center mb-4">
                                                <input id={`item-${index}-${i}`}
                                                    onChange={(e) => {
                                                        let checked = [...checkSelected];
                                                        if (e.target.checked) {
                                                            checked.push({
                                                                item_id: item.id,
                                                                item_ref: item.item_ref,
                                                                item_key: `item-${index}-${i}`,
                                                                estimate_value: item.estimate_value
                                                            })
                                                            setcheckSelected(checked)
                                                        } else {
                                                            setcheckSelected(checked.filter(x => x.item_key !== `item-${index}-${i}`))
                                                        }
                                                    }}
                                                    type="checkbox"
                                                    value=""
                                                    className="w-4 h-4 mr-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>

                                            <img className="h-10 lg:h-16 mr-2" src="/assets/images/order-1.webp" />
                                            <div className='flex flex-col flex-1'>
                                                <label className="text-xs lg:text-base font-semibold">
                                                    {item.type_name} {`(${item.service_name})`} {`${item.tracking_ref}`}
                                                </label>
                                                <div className="flex justify-between flex-1">
                                                    <label className="text-xs lg:text-base">
                                                        Size : {item.size_name} &nbsp;&nbsp;
                                                    </label>
                                                    <label className="text-xs lg:text-base font-regular">
                                                        {item.price_amt} บาท
                                                    </label>
                                                </div>
                                                {
                                                    (checkSelected.find(x => x.item_id == item.id) || item.estimate_value > 0) && <div className='w-40 relative mt-2'>
                                                        <InputComponent
                                                            name={`estimate_value_${item.id}`}
                                                            label="มูลค่าสินค้า"
                                                            placeholder="มูลค่าสินค้า"
                                                            type="number"
                                                            onFocus={item.estimate_value == 0 ?
                                                                () => {
                                                                    let checked = [...orderState.items];
                                                                    const index = checked.findIndex(x => x.id == item.id);
                                                                    checked[index].estimate_value = "";
                                                                    setorderState({ ...orderState, items: checked });
                                                                } : () => { }}
                                                            onChange={(e) => {
                                                                let checked = [...orderState.items];
                                                                const itemIndex = checked.findIndex(x => x.id == item.id);
                                                                checked[itemIndex].estimate_value = e.target?.value ?? "";
                                                                //checked[index].estimate_value = CurrencyThai(checked[index].estimate_value);
                                                                setorderState({ ...orderState, items: checked });
                                                                // setitemsRender(checked);
                                                            }}
                                                            value={item.estimate_value ?? 0}
                                                            errors={fieldErrors}

                                                        />
                                                    </div>
                                                }

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
                    <label className="fond-regular">เหตุผลในการขอเคลมสินค้า <label className="text-red-500">*</label></label>
                    <SelectComponent
                        errors={fieldErrors}
                        name="claimtype_id"
                        label={"กรุณาเลือก"}
                        value={state.claimtype_id}
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
                        rows={2}
                        //label="ที่อยู่"
                        placeholder={""}
                        onChange={(e) => setState({ ...state, claim_note: e.target.value })}
                        value={state.claim_note}
                    //errors={fieldErrors}
                    //required
                    />
                </div>
                {/* <>
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
                                        <img src={url} alt={file.name} className="object-contain h-40 w-52" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </> */}
                {filesRequired.length > 0 &&
                    <div className="flex mt-5 flex-col gap-y-5">
                        <label className="text-blue-primary text-lg font-bold">แนบเอกสารที่เกี่ยวข้อง</label>
                        <div className="flex gap-x-5 gap-y-4 grid grid-cols-2 justify-between">
                            {
                                filesRequired.filter(x => x.customer_type == userState.customer_type || x.customer_type == "normal").map((item, index) => {
                                    return <>
                                        <div className="flex flex-col gap-y-4">
                                            <span>{item.doc_type} <span className="text-sm text-gray-400">({item.condition_text})</span></span>
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
                                                                size: item.condition_size ?? 2,
                                                                type: item.condition_files,
                                                                message: item.condition_message,
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
                                                                if (item.doc_type_code == "doc_5") {
                                                                    const exitsFiles = state.imageDoc5;
                                                                    if (exitsFiles) {
                                                                        const exitsFilesClone = [...exitsFiles]
                                                                        exitsFilesClone.push(files);
                                                                        setState({ ...state, imageDoc5: exitsFilesClone, [item.doc_type_code + "_" + exitsFilesClone.length]: files })
                                                                    }
                                                                    else {
                                                                        setState({ ...state, [item.doc_type_code]: [files] })
                                                                    }
                                                                } else if (item.doc_type_code == "doc_6") {
                                                                    const exitsFiles = state.imageDoc6;
                                                                    if (exitsFiles) {
                                                                        const exitsFilesClone = [...exitsFiles]
                                                                        exitsFilesClone.push(files);
                                                                        setState({ ...state, imageDoc6: exitsFilesClone, [item.doc_type_code + "_" + exitsFilesClone.length]: files })
                                                                    }
                                                                    else {
                                                                        setState({ ...state, [item.doc_type_code]: [files] })
                                                                    }
                                                                } else {
                                                                    setState({ ...state, [item.doc_type_code]: files })
                                                                }

                                                            }

                                                        } else {
                                                            setState({ ...state, [item.doc_type_code]: "" })
                                                        }

                                                    }} />
                                            </label>
                                            {(item.doc_type_code == "doc_5") && state.imageDoc5 &&
                                                <div className="flex flex-col items-start">
                                                    {
                                                        state.imageDoc5.map((subitem, index) => {

                                                            return <span key={"file_" + index} className="text-center">{subitem.name?.replace(`_type_${item.doc_type_code}`, "") ?? "ลากและวางไฟล์ที่นี่เพื่อแนบ หรือ"}</span>
                                                        })
                                                    }
                                                </div>
                                            }
                                            {(item.doc_type_code == "doc_6") && state.imageDoc6 &&
                                                <div className="flex flex-col items-start">
                                                    {
                                                        state.imageDoc6.map((subitem, index) => {

                                                            return <span key={"file_" + index} className="text-center">{subitem.name?.replace(`_type_${item.doc_type_code}`, "") ?? "ลากและวางไฟล์ที่นี่เพื่อแนบ หรือ"}</span>
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>

                                    </>
                                })
                            }
                        </div>
                    </div>
                }
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
    const resultClaim = await ApiMasters.getClaim();
    return {
        props: {

            id: id,
            order: result.data,
            claims: resultClaim.data,
        },
    }
}

export default ClaimPage;