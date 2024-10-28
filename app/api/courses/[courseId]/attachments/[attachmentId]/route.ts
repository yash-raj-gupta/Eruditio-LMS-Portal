import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE (
    req: Request,
    {params}: {params: {courseId: string, attachmentId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const courseOwner = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId
            }
        });

        if(!courseOwner)
        {
            throw new NextResponse("Unauthorized", {status:  401});
        }

        try {
            await db.attachment.delete({
                where:  {
                    courseId: params.courseId,
                    id: params.attachmentId
                }
            });
        } catch (error) {
            console.log("Error deleting attachment:", error);
            throw new NextResponse("Internal Error", {status: 500});
        }

        return new NextResponse("Success", {status: 200});
         
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
