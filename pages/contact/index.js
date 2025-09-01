import Map from "@components/GoogleApi";
import TitleMenu from "@components/TitlePage";
import Link from "next/link";

const ContactPage = () => {
    return <div>

        <TitleMenu imageSrc="/assets/images/contact.webp" title="ติดต่อเรา" description='ติดต่อเรา' />
     
        {/* <div className='px-5 lg:px-24 py-7 grid'>
        </div> */}
        <div className="container mx-auto px-4 mt-7 gap-y-10 flex flex-col">
            <div className="flex flex-center flex-col">
                <h2 className="text-3xl">บริษัท ฟิ้วซ์ โพสต์ จำกัด</h2>
                <label className="text-xl">เลขที่ ตึกศูนย์ฝึกอบรม (APPU) ชั้น4 เลขที่ 111 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210</label>
                <p className="container-text text-xl">เวลาทำการ 9:00-18:00 น. จันทร์-อาทิตย์</p>
            </div>
            <div className="flex flex-wrap gap-y-4 gap-x-40 px-4 justify-between mx-auto">
                <Link href={"tel:020556787"}>
                    <div className="flex gap-x-4 cursor-pointer">
                        <img className="w-24" src={"/assets/contact/tel.png"} />
                        <div className="flex flex-col">
                            <h2 className="text-xl">Tel</h2>
                            <label className="text-lg border-text">02-055-6787</label>
                            <label className="text-blue-700">Call Us</label>
                        </div>
                    </div>
                </Link>
                <Link href={"https://www.facebook.com/fuzepost/"}>
                    <div className="flex gap-x-4 cursor-pointer">
                        <img className="w-24" src={"/assets/contact/facebook.png"} />
                        <div className="flex flex-col">
                            <h2 className="text-xl">Facebook</h2>
                            <label className="text-lg border-text">Fuzepost</label>
                            <label className="text-blue-700">Follow</label>
                        </div>
                    </div>
                </Link>
                <Link href={"https://line.me/ti/p/~@Fuzepost"} >
                    <div className="flex gap-x-4 cursor-pointer">
                        <img className="w-24" src={"/assets/contact/line.png"} />
                        <div className="flex flex-col">
                            <h2 className="text-xl">Line</h2>
                            <label className="text-lg border-text">@Fuzepost</label>
                            <label className="text-blue-700">Add Friend</label>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="flex gap-x-6 mt-10 flex-wrap sm:flex-row flex-col gap-y-10">
                <div className="flex-1">
                    {/* <iframe className="flex-1 w-full h-80"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.2358720276075!2d100.68942009999999!3d13.643410999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d5f3a10d35701%3A0x67a6f9fd67a586d1!2sJWD%20CJ!5e0!3m2!1sth!2sth!4v1665666152617!5m2!1sth!2sth" allowFullScreen=""></iframe> */}
                    <Map />
                </div>
                <div className="flex-1 gap-y-2">
                    <div className='flex-1 mt-10 flex flex-wrap gap-x-10'>
                        <div className="flex flex-col">
                            <h4 className="text-blue-primary">ช่องทางการติดต่อ</h4>
                            <div className="flex flex-col text-sm">
                                <span>อีเมล : cs-online@fuzepost.co.th</span>
                                <a href="tel:020556787" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <span>Call Center 02-0556787</span>
                                </a>
                                {/* <span>Line : @Fuzepost</span> */}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-blue-primary">เวลาทำการ</h4>
                            <div className="flex flex-col text-sm">
                                <span>{`9:00-18:00 น. จันทร์-อาทิตย์`}</span>
                                {/* <span>ไม่เว้นวันหยุดราชการ</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
}

export default ContactPage;