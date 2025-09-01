import TitleMenu from "@components/TitlePage";
import ApiServices from "api/ApiService";
import Head from "next/head";
import { useRouter } from "next/router";

const data = [
    {
        name: "flower1",
        file: "flower1.webp",
        label: "เตรียมบรรจุภัณฑ์สำหรับใส่สินค้า (บรรจุภัณฑ์ต้องมีความแข็งแรง)",
    },
    {
        name: "flower2",
        file: "flower2.png",
        label: "แพ็คสินค้าลงในบรรจุภัณฑ์ที่เตรียมไว้โดยไม่ต้องใส่น้ำแข็งแห้งหรือเจลทำความเย็นใด ๆ",
        description: `(ควรตรวจสอบว่าสินค้าไม่เกิดการเน่าเสียก่อนจัดส่งและสินค้าจะต้องไม่มีการหมดอายุภายใน 1-3 วัน)`
    },
    {
        name: "flower3",
        file: "flower3.webp",
        label: "ปิดบรรจุภัณฑ์ให้มิดชิด เตรียมส่ง",
        description: "สินค้าไม่ถึง 5 กล่อง คิดค่าเข้ารับ 50 บาท/ครั้ง 5 กล่องขึ้นไป เข้ารับสินค้าฟรี"
    }
]

const data2 = [
    {
        size: "S",
        notmore: "ขนาดไม่เกิน 60 cm.",
        priceList: [
            {
                province: "กรุงเทพมหานคร / ปทุมธานี, นนทบุรี, สมุทรปราการ",
                price_chilled: "120 บาท",
                price_frozen: "170 บาท",
            },
            {
                province: "ต่างจังหวัด",
                price_chilled: "200 บาท",
                price_frozen: "250 บาท"
            }
        ]
    },
    {
        size: "M",
        notmore: "ขนาดระหว่าง 61-120 cm.",
        priceList: [
            {
                province: "กรุงเทพมหานคร / ปทุมธานี, นนทบุรี, สมุทรปราการ",
                price_chilled: "170 บาท",
                price_frozen: "220 บาท",
            },
            {
                province: "ต่างจังหวัด",
                price_chilled: "300 บาท",
                price_frozen: "350 บาท"
            }
        ]
    },
    {
        size: "L",
        notmore: "ขนาด 120 cm. ขึ้นไป",
        priceList: [
            {
                province: "กรุงเทพมหานคร / ปทุมธานี, นนทบุรี, สมุทรปราการ",
                price_chilled: "250 บาท",
                price_frozen: "300 บาท",
            },
            {
                province: "ต่างจังหวัด",
                price_chilled: 'No Service',
                price_frozen: 'No Service'
            }
        ]
    }
]

const ChiiledPage = ({ result = {} }) => {

    const renderBG = (size) => {
        if (size == "S") {
            return "bg-blue-5f"
        }
        if (size == "M") {
            return "bg-blue-secondary"
        }
        if (size == "L") {
            return "bg-blue-primary"
        }
    }


    return <div>
        <Head>
            <title>บริการรับส่งสินค้า แช่เย็น/แช่แข็ง</title>
            <meta name="description" content="บริการรับส่งสินค้า แช่เย็น/แช่แข็ง - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <img className="w-full sm:w-full h-32 sm:h-auto object-cover"
            src={process.env.IMAGE_BACKEND_URL + result.banner} />
        <div className="container mx-auto px-4 mt-7 sm:mt-10">
            <div className="flex flex-col">
                <h5 className="text-bold text-blue-primary text-xl">{result.title}</h5>
                <label className="text-black-text" dangerouslySetInnerHTML={{ __html: result.description }}>

                </label>
            </div>
            {/* <div className="flex flex-col mt-10 gap-y-4">
                <h5 className="text-bold text-blue-primary text-xl">บริการรับส่งสินค้า แช่เย็น/แช่แข็ง</h5>
                <div className="flex flex-col gap-y-4 items-center">
                    <img className={`object-contain w-full sm:w-3/4`}
                        src={process.env.IMAGE_BACKEND_URL + result.image} />
                </div>
            </div> */}
            <div className="flex flex-col mt-10">
                <h5 className="text-bold text-blue-primary text-xl">วิธีการแพ็คสินค้า</h5>
            </div>
            <div className="max-w-4xl ml-auto mr-auto">
                {
                    data.map((item, index) => {
                        return <div key={item.name} className="flex-center pb-2 sm:pb-10 pt-10 px-2 relative rounded-lg flex-col border-2 mt-10">
                            <div className={`bg-blue-primary h-10 w-10 flex-center rounded-full absolute`} style={{ top: '-20px' }}>
                                <label className="text-white text-sm sm:text-xl">{index + 1}</label>
                            </div>
                            <img className={`h-24 sm:h-32 object-contain ml-4`} src={`/assets/images/flower/${item.file}`} />
                            <div className="flex flex-col text-center mt-3 sm:mt-10">
                                <label className="text-blue-primary">{item.label}</label>
                                <label className="text-sm text-orange-light">{item.description}</label>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className="flex mt-10 justify-center">
                <div className="sm:whitespace-nowrap flex flex-col text-center bg-blue-CA py-5 px-10 rounded-lg">
                    <label>อุณหภูมิก่อนส่งมอบ</label>
                    <label>Chill 2 ถึง 6 องศาเซลเซียส / Frozen -5 องศาเซลเซียส  ถึง  -15 องศาเซลเซียส</label>
                </div>
            </div>
        </div>
    </div>
}

export async function getServerSideProps({ params }) {
    const result = await ApiServices.get();
    return {
        props: {
            result: result.data
        }
    }
}



export default ChiiledPage;