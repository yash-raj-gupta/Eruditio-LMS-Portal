import { db } from "@/lib/db";
import { Attachment, Chapter, MuxData } from '@prisma/client';

interface GetChapterProps {
    userId: string,
    courseId: string,
    chapterId: string,
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId
}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });


        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapter.findUnique({
            where:{
                id: chapterId,
                isPublished: true,
            }
        });

        if(!chapter || !course){
            throw new Error("Chapter or course not found");
        }

        let muxData : MuxData | null = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if(purchase){
            attachments = await db.attachment.findMany({
                where:{
                    courseId
                }
            });
        }

        if(chapter.isFree || purchase){
            muxData = await db.muxData.findUnique({
                where:{
                    chapterId   
                }
            });

            nextChapter =await db.chapter.findFirst({
                where:{
                    courseId,
                    isPublished: true,
                    position:{
                        gt: chapter?.position
                    }
                },
                orderBy:{
                    position: 'asc'
                }
            });

        }

        const userProgress = await db.userProgress.findUnique({
            where:{
                userId_chapterId:{
                    userId,
                    chapterId
                }
            }
        });

        return {
            course,
            chapter,
            muxData,
            userProgress,
            nextChapter,
            attachments,
            purchase,
        }
    } catch (error) {
        console.log("[GET_CHAPTER_ERROR]", error);
        return {
            course: null,
            chapter: null,
            muxData: null,
            userProgress: null,
            nextChapter: null,
            attachments: [],
            purchase: null,
        }
        
    }

}