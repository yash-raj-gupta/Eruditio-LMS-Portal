import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';


const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
    req: Request,
    {params}: {params: {courseId: string, chapterId: string}}
){
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized", {status:401});
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        if(!chapter){
            return new NextResponse("Not found", {status: 404});
        }

        if(chapter.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where:{
                    chapterId: params.chapterId
                }
            })

            if(existingMuxData){
                await video.assets.delete(existingMuxData.assestId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where:{
                id: params.chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where:{
                courseId: params.courseId,
                isPublished: true
            }
        });

        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where:{
                    id: params.courseId
                },
                data:{
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);
        
    } catch (error) {
        console.log("CHAPTER_ID_DELETE", error);
        return new NextResponse("Internal Error", {status: 500});
        
    }

}

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string, chapterId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId)
            throw new NextResponse("Unauthorized", {status: 401});

       const courseOwner = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId
        }
       });

       if(!courseOwner)
        throw new NextResponse("Unauthorized", {status: 401});

       const {isPublished, ...values} = await req.json();

       const chapter = await db.chapter.update({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        data: {
            ...values
        }
       });

       if(values.videoUrl)
       {
        const existingMuxData = await db.muxData.findFirst({
            where: {
                chapterId: params.chapterId,
            }
        });

        if(existingMuxData)
        {
            await video.assets.delete(existingMuxData.assestId)
            await db.muxData.delete({
                where: {
                    id: existingMuxData.id
                }
            })
        }

        const assest   = await video.assets.create({
            input: values.videoUrl,
            playback_policy: ['public'],
            test: false
        });

        await db.muxData.create({
            data: {
                chapterId: params.chapterId,
                assestId: assest.id,
                playbackId: assest.playback_ids?.[0].id
            }
        })
       }

       return NextResponse.json(chapter);


    } catch (error) {
        console.log("[CHAPTER_ID]", error);
        throw new NextResponse("Internal Error", {status: 500});
    }
}