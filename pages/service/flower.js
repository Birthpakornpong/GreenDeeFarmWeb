import TitleMenu from "@components/TitlePage";
import Head from "next/head";
import { useRouter } from "next/router";

const data = [
    {
        name: "flower1",
        label: "เตรียมบรรจุภัณฑ์สำหรับใส่สินค้า (บรรจุภัณฑ์ต้องมีความแข็งแรง)",
    },
    {
        name: "flower2",
        label: "แพ็คสินค้าลงในบรรจุภัณฑ์ที่เตรียมไว้โดยไม่ต้องใส่น้ำแข็งแห้งหรือเจลทำความเย็นใด ๆ",
        description: `1.ควรตรวจสอบและเช็คสินค้าว่าไม่เกิดการเน่าหรือช้ำก่อนแพ็คสินค้า 
        2.ดอกไม้ควรอยู่ในอณุหภูมิที่ 10-15 องศาเซลเซียสก่อนการจัดส่ง`
    },
    {
        name: "flower3",
        label: "ปิดบรรจุภัณฑ์ให้มิดชิด เตรียมส่ง",
        description: "สินค้าไม่ถึง 5 กล่อง คิดค่าเข้ารับ 50 บาท/ครั้ง 5 กล่องขึ้นไป เข้ารับสินค้าฟรี"
    }
]

const FlowerPage = () => {
    return <div>
        <Head>
            <title>บริการรับส่งดอกไม้</title>
            <meta name="description" content="บริการรับส่งดอกไม้ - Fuze Application" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container mx-auto px-4 mt-7 sm:mt-20">
            <div className="flex flex-col">
                <h5 className="text-bold text-blue-primary text-xl">บริการรับส่งดอกไม้</h5>
                <label className="text-black-text">
                    ด้วยมาตรฐานการขนส่งสินค้าแบบแช่เย็นของ เจดับเบิ้ลยูดี เอ็กซ์เพรส จึงสามารถส่งสินค้าชนิดดอกไม้ได้ ไม่ว่าจะเป็นดอกไม้สดหรือดอกไม้แห้ง และด้วยมาตรฐานรถตู้ทึบ ที่สามารถกักเก็บความเย็น จึงทำให้ดอกไม้ยังสดใหม่ และเบ่งบานอยู่เสมอและไม่เกิดความเสียหาย จึงสามารถขนส่งดอกไม้ได้ทั่วประเทศไทย
                </label>
            </div>
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
                            <img className={`h-24 sm:h-32 object-contain`} src={`/assets/images/flower/${item.name}.webp`} />
                            <div className="flex flex-col text-center mt-3 sm:mt-10">
                                <label className="text-blue-primary">{item.label}</label>
                                <label className="text-sm text-orange-light">{item.description}</label>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}

export default FlowerPage;