import { ClockIcon } from "@heroicons/react/solid";
import ApiNews from "api/ApiNews";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { ConvertDateShortThai } from "utils";
import styles from "./news.module.css";
import { useRouter } from "next/router";

const NewsHome = ({ resultNews = [] }) => {
  const router = useRouter();
  return (
    <div>
      {/* <Head>
        <title>ข่าวสาร</title>
        <meta name="description" content="ข่าวสาร - Fuze Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div className="container mx-auto px-0 sm:px-12 mt-7 sm:mt-0">
        <div className="flex justify-between items-center  p-1 rounded-md mb-5">
          <h3 className="text-left  text-green-700 font-extrabold text-xl sm:text-3xl">
            ข่าวสารประชาสัมพันธ์
          </h3>{" "}
          <button className="text-right bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer transition-colors duration-200"  onClick={() => router.push("/news")}>
            ดูทั้งหมด
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {resultNews.map((item, index) => {
            return (
              <Link key={item.id} href={`/news/${item.id}`}>
                <div
                  key={item.name}
                  className="relative rounded-lg flex-col border-2 border-green-100 bg-white cursor-pointer shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
                  <img
                    className={`w-full rounded-t-md h-[150px] sm:h-[200px] object-cover`}
                    src={item.image}
                  />
                  <div className="flex flex-col p-4 gap-y-2 min-h-[140px]">
                    <label className="font-bold text-green-800 line-clamp-2 hover:text-green-600 transition-colors duration-200 text-base">
                      {item.title}
                    </label>
                    <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                      {item.description
                        .replace(/<[^>]*>/g, "")
                        .replace(/&nbsp;/g, " ")
                        .replace(/&amp;/g, "&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .trim()}
                    </p>
                    <div className="flex gap-x-1 flex-1 items-end">
                      <ClockIcon
                        color="rgb(34, 197, 94)"
                        className="block h-5 w-4"
                        aria-hidden="true"
                      />
                      <small className="text-green-600">
                        {ConvertDateShortThai(item.updatedate, "DD MMM YYYY")}
                      </small>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
// NewsPage.getServerSideProps = async ctx => {
//     const result = await ApiNews.get();
//     return { result: result }
// }
// export async function getServerSideProps({ params }) {
//     const result = await ApiNews.get();
//     return {
//         props: {
//             result: result.data
//         }
//     }
// }

export default NewsHome;
