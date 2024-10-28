"use client"
import {useState} from 'react'
import * as z from 'zod'
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[]}
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
})


const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current)


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success('Course updated');
            toggleEdit();
            router.refresh();
            
        } catch (error) {
            toast.error('Something went wrong');
        }
    }

    const onDelete = async (id: string ) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            
        }finally{
            setDeletingId(null);
        }
    }



    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Course Attachments
                 <Button variant={'ghost'} onClick={toggleEdit}>
                  {isEditing && (
                    <>
                    Cancel
                    </>
                )}

                {!isEditing && (
                    <>
                    <PlusCircle className='w-4 h-4 mr-2'/>
                    Add a file
                    </>
                )}
                  
                </Button>

                  
            </div>
            {!isEditing && (
              <>
              {initialData.attachments.length === 0 && (
                <p className='text-sm italic text-slate-500 mt-2'>No attachments</p>
              )}

              {initialData.attachments.length > 0 && (
                <div className="space-y-2">
                    {initialData.attachments.map((attachment) => (
                        <div className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 rounded-md text-sky-300"
                        key={attachment.id}
                        >
                            <File className='w-4 h-4 mr-2 flex-shrink-0'/>
                            <p className='text-xs line-clamp-1'>{attachment.name}
                        </p>
                        {deletingId === attachment.id && (
                            <div className="ml-auto">
                                <Loader2 className='w-4 h-4 animate-spin'/>
                            </div>
                        )}
                        {deletingId !== attachment.id && (
                            <button
                            onClick={() => onDelete(attachment.id)}
                            className="ml-auto hover:opacity-75">
                                <X className='w-4 h-4 '/>
                            </button>
                        )}

                        </div>
                    ))}
                </div>
              )}
              </>
            )}
            {isEditing && (
                <div className="">
                    <FileUpload
                    endpoint='courseAttachment'
                    onChange={(url) => {
                        try {
                            if (url) {
                                onSubmit({ url: url });
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
                        Add anything your students might need to complete the course
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default AttachmentForm;