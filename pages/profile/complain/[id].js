import Map from "@components/GoogleApi";
import InputComponent from "@components/Input";
import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiUsers from "api/ApiUsers";
import _ from "lodash";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import ApiOrders from "api/ApiOrders";

const ComplainPage = ({ complains = [], order = {} }) => {
    const router = useRouter()
    const [state, setState] = useState({

    });

    const [complain_note, setcomplain_note] = useState('');
    const [masterComplains, setmasterComplains] = useState([]);

    useEffect(() => {
        const groups = _(complains)
            .groupBy(o => o.complain)
            .map((items, key) => ({ value: key, label: key, items: items, complain_type: items[0].complain_type }))
            .value();
        setmasterComplains(groups)
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const model = {
            complain_answer: state,
            complain_note: complain_note,
            order_id: order.id
        }
        const result = await ApiUsers.complain(model);
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

    return <div>
        <Toaster
            reverseOrder={false}
        />
        <TitleMenu imageSrc="/assets/images/complain_menu.webp" title="ติชม/แนะนำ" description='' />
      
        <form onSubmit={submit}>
            <div className="container mx-auto px-4 mt-7 gap-y-4 flex flex-col">
                {
                    masterComplains.map((item, index) => {
                        return <div key={`master-${index}`} className="flex flex-col gap-y-4">
                            <div className="p-5 rounded-lg bg-blue-sky">
                                <label>
                                    {item.value}
                                </label>
                            </div>
                            <div className="flex flex-col">
                                {
                                    item.items.map((question, questionIndex) => {
                                        if (item.complain_type == "checkbox") {
                                            return <div key={`${item.value}-${questionIndex}`} className="flex items-center mb-4">
                                                <input id={`${item.value}-${questionIndex}`}
                                                    onChange={(e) => {
                                                        let key = `complain_id_` + question.complain_id;
                                                        let checked = []
                                                        if (state[key] == undefined) {
                                                            checked = []
                                                        } else {
                                                            checked = state[key]
                                                        }

                                                        if (e.target.checked) {
                                                            checked.push({
                                                                question: question.question,
                                                            })
                                                            setState({
                                                                ...state,
                                                                [key]: checked
                                                            })
                                                        } else {
                                                            checked = state[key];
                                                            setState({
                                                                ...state,
                                                                [key]: checked.filter(x => x.question !== question.question)
                                                            })
                                                            //setcheckSelected(checked.filter(x => x.item_key !== `item-${index}-${i}`))
                                                        }
                                                    }}
                                                    type={`checkbox`}
                                                    className="w-4 h-4 sm:w-5 sm:h-5  mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label className="form-check-label inline-block text-gray-800 text-sm font-bold sm:text-lg"
                                                    htmlFor={`${item.value}-${questionIndex}`}>
                                                    {question.question}
                                                </label>
                                            </div>
                                        } else if (item.complain_type == "radiobox") {
                                            return <div key={`${item.value}-${questionIndex}`} className="flex items-center mb-4">
                                                <input id={`${item.value}-${questionIndex}`}
                                                    name={`${item.value}`}
                                                    value={question.question}
                                                    onChange={(e) => {
                                                        setState({
                                                            ...state,
                                                            [`complain_id_` + question.complain_id]: e.target.value
                                                        })
                                                    }}
                                                    type="radio"
                                                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label className="form-check-label inline-block text-gray-800 text-sm font-bold sm:text-lg font-bold"
                                                    htmlFor={`${item.value}-${questionIndex}`}>
                                                    {question.question}
                                                </label>
                                            </div>
                                        }
                                    })
                                }

                            </div>
                        </div>
                    })
                }
                <div className="border-b h-1"></div>
                <div className="flex gap-y-2 mt-2 flex-col">
                    <label className="fond-regular">คำอธิบายเพิ่มเติม</label>
                    <InputComponent
                        isInput={false}
                        name="complain_note"
                        rows={2}
                        //label="ที่อยู่"
                        placeholder={""}
                        onChange={(e) => setcomplain_note(e.target.value)}
                        value={complain_note}
                    //errors={fieldErrors}
                    //required
                    />
                </div>
                <button className="px-16 mt-5 py-3 bg-blue-primary w-64 rounded-md text-white mt-3">
                    ยืนยัน
                </button>

            </div>
        </form>
    </div>
}


export async function getServerSideProps(params) {
    const resultComplain = await ApiMasters.getComplain();
    const result = await ApiOrders.findOrder(params.query.id);
    return {
        props: {
            order: result.data,
            complains: resultComplain.data,
        },
    }
}

export default ComplainPage;