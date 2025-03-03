import { getChapter } from "@/actions/get-chapter";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Banner from '@/components/banner';
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async({
    params
}: {params: {courseId: string, chapterId: string}}) => {

    const {userId} = auth();
    if(!userId){
        return redirect('/');
    }

    const {
        course, chapter,attachments, muxData, nextChapter, userProgress, purchase
    } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chapterId
    });

    if(!chapter || !course){
        return redirect('/');
    }

    const isLocked= !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    



    return ( 
        <div className="">
            {userProgress?.isCompleted && (
                <Banner
                variant={'success'}
                label = "You already completed this chapter"
                />
            )}
            {isLocked && (
                <Banner
                variant={'warning'}
                label = "You need to purchase this course to access this chapter"
                />
            )}
            <div className="flex flex-col pb-20  max-w-4xl mx-auto">
                <div className="p-4">
                    <VideoPlayer
                    chapterId={params.chapterId}
                    title={chapter.title}
                    courseId={params.courseId}
                    nextChapterId={nextChapter?.id}
                    playbackId={muxData?.playbackId!}
                    isLocked={isLocked}
                    completeOnEnd={completeOnEnd}
                    />
                </div>
                <div className="">
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl mb-2 font-semibold ">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                             <CourseProgressButton
                             courseId={params.courseId}
                             chapterId={params.chapterId}
                             nextChapterId={nextChapter?.id}
                             isCompleted={!!userProgress?.isCompleted}
                             />
                        ): (
                            <CourseEnrollButton
                            courseId={params.courseId}
                            price={course.price!}
                            />

                        )}
                    </div>
                    <Separator  />
                    <div className="">
                        <Preview  value={chapter.description!}/>
                    </div>
                    {!!attachments.length && (
                        <>
                        <Separator/>
                        <div className="p-4">
                            {attachments.map((attachment)  => (
                                <a
                                href={attachment.url}
                                key={attachment.id}
                                target="_blank"
                                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                >
                                    <File/>
                                    <p className="line-clamp-1">
                                        {attachment.name}
                                    </p>

                                </a>
                            )

                            )}
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default ChapterIdPage;