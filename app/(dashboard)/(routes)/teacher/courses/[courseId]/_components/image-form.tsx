"use client"
import {useState} from 'react'
import * as z from 'zod'
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ImageFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: 'Image is required'
    })
})


const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current)


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
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
                Course Image
                 <Button variant={'ghost'} onClick={toggleEdit}>
                  {isEditing && (
                    <>
                    Cancel
                    </>
                )}

                {!isEditing && !initialData.imageUrl && (
                    <>
                    <PlusCircle className='w-4 h-4 mr-2'/>
                    Add an image
                    </>
                )}
                  
                  {!isEditing && initialData.imageUrl  && (
                     <>
                     <Pencil className='w-4 h-4 mr-2'/>
                     Edit Image
                     </>
                  )}
                </Button>

                  
            </div>
            {!isEditing && (
               !initialData.imageUrl ? (
                <div className="flex justify-center items-center h-60 rounded-md bg-slate-200">
                    <ImageIcon className='w-10 h-10 text-slate-500'/>
                </div>
               ): (
                <div className="relative aspect-video mt-2">
                    <Image
                    alt="Upload"
                    fill
                    src={initialData.imageUrl || ''}
                    className='rounded-md object-cover'
                    />
                </div>
               )
            )}
            {isEditing && (
                <div className="">
                    <FileUpload
                    endpoint='courseImage'
                    onChange={(url) => {
                        try {
                            if (url) {
                                onSubmit({ imageUrl: url });
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
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default ImageForm;