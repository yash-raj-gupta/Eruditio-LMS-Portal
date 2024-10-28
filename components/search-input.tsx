"use client"

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { title } from "process"

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname, 
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue
            }
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);


    return (
        <div className="relative">
            <Search
            className="absolute top-3 left-3 w-4 h-4 text-slate-600"
            />
            <Input
            onChange = {(e) => setValue(e.target.value)}
            value={value}
            className="pl-9 w-full md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-200"
            placeholder="Search for a course"
            />
        </div>
    )
}