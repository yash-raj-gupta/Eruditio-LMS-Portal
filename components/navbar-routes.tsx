'use client'

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherMode = pathname?.startsWith("/teacher");
    const isPlayerMode = pathname?.includes('/chapter')
    return (
        <div className="flex gap-x-2 ml-auto">
            {isTeacherMode || isPlayerMode ? (
                <Link href='/teacher/courses'>
                <Button  size={'sm'} variant={'ghost'}>
                    <LogOut className="w-4 h-4 mr-2 "/>
                    Exit
                </Button>
                </Link>
            ): (
                <Link href='/teacher/courses'>
                <Button size={'sm'} variant={'ghost'}>
                    Teacher Mode
                </Button>
                </Link>
            )}
            <UserButton/>
        </div>
    )
}