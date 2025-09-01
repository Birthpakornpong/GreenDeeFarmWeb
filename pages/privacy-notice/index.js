import TitleMenu from "@components/TitlePage";
import ApiMasters from "api/ApiMasters";
import ApiNews from "api/ApiNews";
import 'quill/dist/quill.snow.css'
import { useEffect } from "react";

const PrivacyNotice = ({ result = {} }) => {
  useEffect(() => {
    console.log('terms', result)
  }, []);
  return (
    <div>
      <TitleMenu
          imageSrc="/assets/images/faq.webp"
          title="Privacy Notice"
          description="ประกาศนโยบายความเป็นส่วนตัว"
        />
      <div className="flex flex-col px-5 sm:flex-row sm:px-20 sm:gap-10 mt-5">
        {result?.html_text && <div dangerouslySetInnerHTML={{ __html: result?.html_text }}></div>}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const config = await ApiMasters.getContentByCode('privacy_notice_page');
  return {
    props: {
      result: config.data
    },
  };
}

export default PrivacyNotice;
