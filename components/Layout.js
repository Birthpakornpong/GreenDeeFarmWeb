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
          Green Dee Farm : ผู้ผลิตและจำหน่ายผักไฮโดรโปนิกส์
          ผักใบเขียวออร์แกนิค สด สะอาด ปลอดภัย ภาคใต้
        </title>
        <meta
          name="description"
          content="Green Dee Farm ฟาร์มผักไฮโดรโปนิกส์ครบวงจร เชียวกรีนโอ๊ค ออกแดง Green Cos สดใหม่ทุกวัน ปลอดสารเคมี เก็บตรงจากฟาร์ม 
จำหน่ายทั่วภูเก็ต พังงา กระบี่ โทร 064-542-0333 Line: birhids สั่งซื้อออนไลน์ส่งฟรีถึงบ้าน"
        />
        {/* Favicon และ Icons */}
        <link rel="icon" type="image/jpeg" href="/assets/images/farm/logoGreenDee.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="/assets/images/farm/logoGreenDee.jpg" />
        <link rel="apple-touch-icon" href="/assets/images/farm/logoGreenDee.jpg" />
        <meta name="msapplication-TileImage" content="/assets/images/farm/logoGreenDee.jpg" />
        {/* ถ้าอยากให้สวยบนโซเชียลสามารถใส่ OG Tags ได้ด้วย */}
        <meta
          property="og:title"
          content="Green Dee Farm : ฟาร์มผักไฮโดรโปนิกส์ออร์แกนิค ภาคใต้"
        />
        <meta
          property="og:description"
          content="Green Dee Farm ผู้ผลิตผักไฮโดรโปนิกส์สด สะอาด ปลอดสารเคมี เชียวกรีนโอ๊ค ออกแดง Green Cos จัดส่งทั่วภูเก็ต พังงา กระบี่"
        />
        <meta property="og:image" content="/assets/images/farm/logoGreenDee.jpg" />
        <meta property="og:type" content="website" />
        <meta
          name="twitter:title"
          content="Green Dee Farm : ผักไฮโดรโปนิกส์ออร์แกนิค"
        />
        <meta
          name="twitter:description"
          content="ฟาร์มผักสดใหม่ ปลอดสารเคมี จัดส่งทั่วภาคใต้ โทร 064-542-0333 Line: birhids"
        />
        <meta name="twitter:site" content="@GreenDeeFarm" />{" "}
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
