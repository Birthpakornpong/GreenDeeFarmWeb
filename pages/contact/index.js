import Map from "@components/GoogleApi";
import TitleMenu from "@components/TitlePage";
import Link from "next/link";

const ContactPage = () => {
    return <div>

        <TitleMenu imageSrc="/assets/images/farm/banner1.jpg" title="ติดต่อเรา" description='Green Dee Farm - ฟาร์มผักสลัดออร์แกนิกคุณภาพสูง' />
     
        <div className="container mx-auto px-4 mt-7 gap-y-10 flex flex-col">
            <div className="flex flex-center flex-col bg-green-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-green-600 mb-4">Green Dee Farm</h2>
                <div className="text-center max-w-2xl">
                    <label className="text-lg text-gray-700 block mb-2">
                        🌱 ฟาร์มผักสลัดออร์แกนิกคุณภาพสูง
                    </label>
                    <label className="text-base text-gray-600 block mb-4">
                        📍 อำเภอเมือง จังหวัดภูเก็ต 83000
                    </label>
                    <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
                        <p className="text-lg font-medium">⏰ เวลาทำการ 9:00-18:00 น. จันทร์-อาทิตย์</p>
                    </div>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <Link href={"tel:0645420333"}>
                    <div className="flex flex-col items-center text-center cursor-pointer bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:border-green-400 group">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 group-hover:bg-green-600 transition-colors">
                            📞
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">โทรศัพท์</h2>
                        <label className="text-lg text-green-600 font-semibold mb-2">064-542-0333</label>
                        <label className="text-green-700 font-medium text-sm">โทรเลย</label>
                    </div>
                </Link>
                <Link href={"https://www.facebook.com/profile.php?id=100075999497749"} target="_blank">
                    <div className="flex flex-col items-center text-center cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:border-blue-400 group">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 group-hover:bg-blue-600 transition-colors">
                            👍
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Facebook</h2>
                        <label className="text-lg text-blue-600 font-semibold mb-2">Green Dee Farm</label>
                        <label className="text-blue-700 font-medium text-sm">ติดตาม</label>
                    </div>
                </Link>
                <Link href={"https://www.tiktok.com/@chinjungmeow"} target="_blank">
                    <div className="flex flex-col items-center text-center cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-200 hover:border-pink-400 group">
                        <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 group-hover:bg-pink-600 transition-colors">
                            🎵
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">TikTok</h2>
                        <label className="text-lg text-pink-600 font-semibold mb-2">Green Dee Farm</label>
                        <label className="text-pink-700 font-medium text-sm">ติดตาม</label>
                    </div>
                </Link>
                <Link href={"https://line.me/ti/p/~birthids"} target="_blank">
                    <div className="flex flex-col items-center text-center cursor-pointer bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:border-green-400 group">
                        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-white text-2xl mb-4 group-hover:bg-green-500 transition-colors">
                            💬
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Line</h2>
                        <label className="text-lg text-green-600 font-semibold mb-2">birthids</label>
                        <label className="text-green-700 font-medium text-sm">แชท</label>
                    </div>
                </Link>
            </div>
            <div className="flex gap-x-6 mt-10 flex-wrap sm:flex-row flex-col gap-y-10">
                {/* <div className="flex-1">
                       <Map />
                </div> */}
                <div className="flex-1 gap-y-2">
                    <div className='flex-1 bg-white p-6 rounded-lg shadow-lg'>
                        <h3 className="text-2xl font-bold text-green-600 mb-6">ข้อมูลการติดต่อ</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <h4 className="text-green-700 font-bold text-lg mb-3">ช่องทางการติดต่อ</h4>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">📧</span>
                                        <span>อีเมล: birdpakornpong@gmail.com</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">📱</span>
                                        <a href="tel:0645420333" className="text-green-700 hover:underline">
                                            <span>โทร: 064-542-0333</span>
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">💬</span>
                                        <span>Line ID: birhids</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-green-700 font-bold text-lg mb-3">เวลาทำการ</h4>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">🕘</span>
                                        <span>9:00-18:00 น.</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">📅</span>
                                        <span>จันทร์-อาทิตย์</span>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg mt-4">
                                        <p className="text-green-700 text-sm">
                                            🌱 สั่งซื้อผักสลัดสดใหม่ได้ทุกวัน<br/>
                                            🚚 จัดส่งฟรีในจังหวัดภูเก็ต
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
}

export default ContactPage;