"use client"
import {useState} from 'react'
import * as z from 'zod'
import axios from 'axios';
import MuxPlayer from '@mux/mux-player-react'
import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Chapter, Course, MuxData } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData| null},
    courseId: string;
    chapterId: string
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})


const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current)


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success('Course updated');
            toggleEdit();
            router.refresh();
            
        } catch (error) {
            toast.error('Something went wrong');
        }
    }



    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Chapter video
                 <Button variant={'ghost'} onClick={toggleEdit}>
                  {isEditing && (
                    <>
                    Cancel
                    </>
                )}

                {!isEditing && !initialData.videoUrl && (
                    <>
                    <PlusCircle className='w-4 h-4 mr-2'/>
                    Add an video
                    </>
                )}
                  
                  {!isEditing && initialData.videoUrl  && (
                     <>
                     <Pencil className='w-4 h-4 mr-2'/>
                     Edit video
                     </>
                  )}
                </Button>

                  
            </div>
            {!isEditing && (
               !initialData.videoUrl ? (
                <div className="flex justify-center items-center h-60 rounded-md bg-slate-200">
                    <Video className='w-10 h-10 text-slate-500'/>
                </div>
               ): (
                <div className="relative aspect-video mt-2">
                    <MuxPlayer
                    playbackId={initialData?.muxData?.playbackId || ""}
                    />
                </div>
               )
            )}
            {isEditing && (
                <div className="">
                    <FileUpload
                    endpoint="chapterVideo"
                    onChange={(url) => {
                        try {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            } else {
                                throw new Error("URL is undefined");
                            }
                        } catch (error) {
                            console.error("Failed to handle file upload:", error);
                            toast.error("Failed to upload file. Please try again.");
                        }
                    }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
     );
}
 
export default ChapterVideoForm;