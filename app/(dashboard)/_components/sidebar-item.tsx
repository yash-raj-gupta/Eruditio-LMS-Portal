'use client'

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface SidebarItemProps{
    icon: LucideIcon,
    label: string,
    href: string
}


export const SidebarItem = ({
    icon: Icon,
     label,
      href
}: SidebarItemProps) => {
    
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
    (pathname === '/' && href === '/') || //  check for the root page
    pathname === href ||
    pathname?.startsWith(`${href}/`)  //subroute of a specific route
    
    const handleClick = () => {
        router.push(href)
    }

    return (
        <button
        onClick={handleClick}
        type="button"
        className={cn("flex items-center gap-x-2  text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", 
            isActive && 'text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20'
        )}>
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                size={22}
                className={cn('text-slate-500',
                    isActive &&  'text-sky-700'
                )}
                />
                 {label}
            </div>
            {/* the self closing div gives a nice bar on the right of the selection */}
              <div className={cn('ml-auto opacity-0 border-2 border-sky-700  h-full transition-all',
                isActive && 'opacity-100'
              )}/>
        </button>
    )
}