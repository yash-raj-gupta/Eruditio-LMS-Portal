import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        if(!userId)
            throw new NextResponse("Unauthorized", {status:401});

        const {list} = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if(!courseOwner)
            throw new NextResponse("Unauthorized", {status: 401});
           
        
        for (let item of list ){
            try{
            await db.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position
                }
            })
        }catch(error)
        {
            console.log("re",error);
            throw new NextResponse("Internal error", {status: 500});
        }
        }

        return new NextResponse("Success", {status: 200});

    } catch (error) {
        console.log("Reorder error", error);
        throw new NextResponse("Internal Error ", {status: 500});
    }
}