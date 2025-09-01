import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/"; // ตรวจสอบว่าเป็นหน้าแรกหรือไม่

  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <Head>
        <title>
          Fuze Post : ผู้ให้บริการขนส่งและ โลจิสติกส์โซลูชันส์
          สินค้าควบคุมอุณหภูมิ (แช่เย็น แช่แข็ง) ทั่วไทย
        </title>
        <meta
          name="description"
          content="ฟิ้วโพสต์ คือ ผู้ให้บริการขนส่งเย็นในความร่วมมือของไปรษณีย์ไทย แฟลช เอ็กซ์เพรส และเอสซีจี เจดับเบิ้ลยูดี โลจิสติกส์ จำกัด (มหาชน)
พร้อมสนับสนุนผู้ประกอบการธุรกิจ สินค้าควบคุมอุณหภูมิ อาทิ เช่น อาหารสด อาหารแปรรูป อาหารพื้นเมือง ผลไม้สด สู่ตลาดที่กว้างขึ้น ด้วยโครงข่ายขนส่งด่วนทั่วไทย"
        />
        {/* ถ้าอยากให้สวยบนโซเชียลสามารถใส่ OG Tags ได้ด้วย */}
        <meta
          property="og:title"
          content="Fuze Post : ผู้ให้บริการขนส่งและโลจิสติกส์โซลูชันส์แช่เย็น แช่แข็ง ทั่วไทย"
        />
        <meta
          property="og:description"
          content="ฟิ้วโพสต์ คือ ผู้ให้บริการขนส่งเย็น ร่วมกับไปรษณีย์ไทย แฟลช เอ็กซ์เพรส และ SCG JWD พร้อมช่วยผู้ประกอบการขยายตลาดสินค้าแช่เย็นทั่วประเทศ"
        />
        {/* <meta property="og:image" content="/images/your-og-image.jpg" /> */}
        <meta property="og:type" content="website" />
        <meta
          name="twitter:title"
          content="Fuze Post : ขนส่งควบคุมอุณหภูมิทั่วไทย"
        />
        <meta
          name="twitter:description"
          content="บริการขนส่งเย็นทั่วไทย โดยความร่วมมือกับไปรษณีย์ไทย แฟลช และ SCG JWD"
        />
        <meta name="twitter:site" content="@FuzePost" />{" "}
        {/* ถ้ามี Twitter handle */}
      </Head>
      <Header />
      <div
        className={`pt-28 sm:pt-36 md:pt-36 lg:pt-28 bg-[#fff] ${
          isHomePage ? "" : "pb-10"
        }`}>
        {children}
      </div>
      <Footer />
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
