import Image from "next/image";

const TitleMenu = ({ title = "", imageSrc = "", description = "", imageClass = "" }) => {
    return <div className="w-full bg-blue-secondary h-28 sm:h-36 rounded-tl-full flex items-center ">
        <img src={imageSrc} className={imageClass ? imageClass : `h-20 sm:h-24`} />
        <div className="flex flex-col ml-10">
            <h1 className="text-xl sm:text-2xl text-blue-primary">{title}</h1>
            {description && <label className="text-white text-sm sm:text-base">{description}</label>}
        </div>
    </div>
}

export default TitleMenu;