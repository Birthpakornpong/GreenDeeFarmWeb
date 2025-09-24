import TitleMenu from "@components/TitlePage";
import ApiNews from "api/ApiNews";
import "quill/dist/quill.snow.css";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import faqData from "../../json/faqData";
const FAQPage = () => {
  const [result, setResult] = useState([]);
  const [faqSelect, setFaqSelect] = useState(0);

  useEffect(() => {
    async function fetchFAQ() {
      try {
        // const res = await ApiNews.getFAQ();
        setResult(faqData);
        if (faqData && faqData.length > 0) setFaqSelect(faqData[0].id);
      } catch (e) {
        setResult([]);
      }
    }
    fetchFAQ();
  }, []);

  const scrollTo = (ref) => {
    const violation = document.getElementById(ref);
    let rect = violation.getBoundingClientRect();
    window.scrollTo({
      top:
        rect.top < 0
          ? rect.top + window.scrollY
          : rect.top + window.scrollY - 100,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <TitleMenu
        imageSrc="/assets/images/farm/banner1.jpg"
        title="คำถามที่พบบ่อย"
        description="Green Dee Farm - ข้อมูลเกี่ยวกับผักสลัดออร์แกนิกคุณภาพสูง"
      />
      <div className="flex flex-col sm:flex-row sm:px-20 sm:gap-10">
        <div
          className="flex flex-col px-5 py-7 sm:py-10 gap-3"
          style={{ width: "25rem" }}>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                <div
                  className={`flex flex-col w-full justify-between ${
                    open ? "rounded-bl-none rounded-br-none" : ""
                  }`}>
                  <Disclosure.Button
                    className={
                      "group flex w-full items-center justify-between py-3"
                    }>
                    <span className="text-left font-extrabold text-2xl flex-1 text-green-700">
                      คำถามเกี่ยวกับผักสลัดออร์แกนิก
                    </span>
                    {/* <ChevronDownIcon
                      className={
                        open ? "rotate-180 transform h-6 w-8" : "h-6 w-8"
                      }
                    /> */}
                  </Disclosure.Button>
                </div>
                <Disclosure.Panel className={"w-full  pb-1 text-md"}>
                  {result.map((item) => {
                    return (
                      <div
                        key={`faq_item_${item.id}`}
                        className={`text-left  font-bold py-3 cursor-pointer hover:text-green-600 transition-colors ${
                          item.id == faqSelect
                            ? "text-green-600 text-xl"
                            : ""
                        }
                      }`}
                        onClick={async () => {
                          await setFaqSelect(item.id);
                          scrollTo(`content_` + item.id);
                        }}>
                        <span
                          className={`text-2xl mr-1 ${
                            item.id == faqSelect ? "" : "hidden"
                          }`}>
                          •
                        </span>{" "}
                        {item.question}
                      </div>
                    );
                  })}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="flex flex-col sm:mt-3">
          {result.map((item, index) => {
            return (
              <div
                id={`content_` + item.id}
                key={`content_` + item.id}
                className={`${item.id == faqSelect ? "flex" : "hidden"}`}>
                <div className="py-10">
                  <div className="px-5">
                    <div className="text-xl font-bold text-green-700 mb-4">{item.question}</div>
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                  </div>
                </div>
                {index < result.length - 1 && (
                  <hr className="ml-5 border-[1px] border-green-300 border-dashed" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default FAQPage;
