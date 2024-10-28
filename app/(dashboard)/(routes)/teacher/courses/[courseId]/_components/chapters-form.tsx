"use client"
import {useState} from 'react'
import * as z from 'zod'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form'

import {
Form,
FormControl,
FormField,
FormItem,
FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Chapter, Course } from '@prisma/client';
import { title } from 'process';
import { ChaptersList } from './chapters-list';

interface ChaptersFormProps {
    initialData: Course & {chapters: Chapter[]}
    courseId: string;
}

const formSchema = z.object({
   title: z.string().min(1),
})


const ChaptersForm = ({
    initialData,
    courseId
}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter();

    const toggleCreate = () => setIsCreating((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    })
    
    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success('Chapter Created');
            toggleCreate();
            router.refresh();
            
        } catch (error) {
            toast.error('Something went wrong');
        }
    }

    const onReorder = async (updatedData: {id: string, position: number}[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updatedData
            });

            toast.success("Chapters Reordered");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }



    return ( 
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="flex items-center justify-center w-full h-full absolute right-0 top-0 bg-slate-500/20 rounded-md">
                    <Loader2
                    className='w-6 h-6 animate-spin text-sky-700'
                    />
                </div>
            )}
            <div className="flex items-center justify-between font-medium">
                Course Chapters
                 <Button variant={'ghost'} onClick={toggleCreate}>
                  {!isCreating ? (
                    <>
                    <PlusCircle className='w-4 h-4 mr-2'/>
                    Add a Chapter
                    </>
                ):(
                    <>
                    Cancel
                    </>
                )}
                </Button>

                  
            </div>
            {isCreating && 
               (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                      <FormField
                      control={form.control}
                      name = 'title'
                      render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                disabled={isSubmitting}
                                placeholder="e.g. 'Introduction to the course'"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}
                      />
                        <Button
                        disabled={!isValid || isSubmitting}
                        type='submit'
                        //  className='flex items-center gap-x-2'
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    'text-sm mt-2',
                    !initialData.chapters.length && 'text-slate-500 italic'
                )}>
                    {!initialData.chapters.length && 'No Chapters'}
                    <ChaptersList
                    onEdit={onEdit}
                    onReorder={onReorder}
                    items={initialData.chapters || []}
                    />
                </div>
            )
            }
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the  chapters
                </p>
            )
            }
        </div>
     );
}
 
export default ChaptersForm;