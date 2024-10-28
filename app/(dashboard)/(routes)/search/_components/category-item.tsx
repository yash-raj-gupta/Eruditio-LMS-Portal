"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { use } from "react"
import { IconType } from "react-icons/lib"
import qs from "query-string"

interface CategoryItemProps  {
    label: string
    value?: string
    icon?: IconType
}
export const CategoryItem  = ({
    label, value, icon: Icon
}: CategoryItemProps)=>{

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");

    const currentTitle = searchParams.get("title");
    const isSelcted = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelcted? null : value
            }
        }, {skipEmptyString: true, skipNull: true});
        router.push(url);
    }
    return (
        <button className={cn(
            "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 transition hover:border-sky-700",
            isSelcted && "border-sky-700 bg-sky-200/20 text-sky-800"
        )}
        type="button"
        onClick={onClick}
        > 
        {Icon && <Icon size={20}/>}
        <div className="truncate">
            {label}
        </div>
        </button>
    )
}