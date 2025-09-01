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
          <h3 className="text-left text-blue-900 font-extrabold text-xl sm:text-3xl">
            ข่าวสารประชาสัมพันธ์
          </h3>{" "}
          <button className="text-right  bg-blue-primary text-white px-4 py-2 rounded hover:bg-blue-primary  cursor-pointer"  onClick={() => router.push("/news")}>
            ดูทั้งหมด
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {resultNews.map((item, index) => {
            return (
              <Link key={item.id} href={`/news/${item.id}`}>
                <div
                  key={item.name}
                  className="relative rounded-lg flex-col border-2 bg-white cursor-pointer">
                  <img
                    className={`w-full rounded-t-md h-[150px] sm:h-[200px] object-cover`}
                    src={process.env.IMAGE_BACKEND_URL + item.image}
                  />
                  <div className="flex flex-col p-2 px-3 gap-y-1 h-28">
                    <label className="font-bold text-black line-clamp-1">
                      {item.title}
                    </label>
                    <small
                      className={`text-gray-link line-clamp-2 ${styles.small_description}`}>
                      {item.description
                        .replace(/<[^>]*>?/gm, "")
                        .replace(/&nbsp;/g, " ")}
                    </small>
                    <div className="flex gap-x-1 flex-1 items-end">
                      <ClockIcon
                        color="#666"
                        className="block h-5 w-4"
                        aria-hidden="true"
                      />
                      <small>
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
