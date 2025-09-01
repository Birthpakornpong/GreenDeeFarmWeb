import Link from "next/link";

const CardMenu = ({ title = "", description = "", className, href = "/", icon }) => {
    return (
        <Link href={href}>
            <div className={`h-30 sm:h-40 bg-blue-secondary rounded-lg flex relative px-10 py-5 items-end rounded-tl-50 sm:rounded-tl-100  ${className}`}>
                <div className="flex flex-col">
                    <label className="text-white text-2xl font-bold">{title}</label>
                    <label className="text-blue-primary text-lg">{description}</label>
                </div>
                <img className="absolute right-5 h-24 sm:h-32" style={{ top: -40 }}
                    src={icon} />
            </div>
        </Link>
    )
}

export default CardMenu;