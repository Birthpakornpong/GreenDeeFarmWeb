import { useEffect, useState } from "react";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768); // หรือ 576 / 992 ตามที่คุณต้องการ
        };

        checkIsMobile(); // ตรวจตอน mount
        window.addEventListener("resize", checkIsMobile); // ตรวจตอน resize

        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
};

export default useIsMobile;
