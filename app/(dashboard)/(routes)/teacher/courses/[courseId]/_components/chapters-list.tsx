"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";

import {
 DragDropContext,
 Droppable,
 Draggable,
 DropResult
} from '@hello-pangea/dnd'

import {cn} from '@/lib/utils';
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface ChaptersListProps{
items: Chapter[],
onReorder: (updateData: {id: string, position: number}[]) => void,
onEdit: (id: string) => void

}


export  const ChaptersList =({
    onEdit,
    onReorder,
    items
}: ChaptersListProps) => {
    
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);
 // this mounting thing is done to prevent the hydration error that occurs because first the component renders in the server side then the client side and the drag and drop package is not that much otimized for the same.
    useEffect(() => {
        setIsMounted(true)
    },[]);

    //This one is for  rehydrating the chapters state
    useEffect(() => {
        setChapters(items)
    },[items]);

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return ;

        const items =Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index,1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
        const updatedChapters = items.slice(startIndex, endIndex +1);

        setChapters(items);

        const bulkUpdatedData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));
        onReorder(bulkUpdatedData)
    }

    if(!isMounted){
        return null;
    }



  return (
    <DragDropContext onDragEnd={onDragEnd}>
         <Droppable droppableId="chapters">
            { (provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} >
                    {
                        chapters.map((chapter, index) => (
                            <Draggable
                            key={chapter.id}
                            draggableId={chapter.id}
                            index={index}
                            >
                                {(provided) => (
                                    <div className={cn(
                                        'flex items-center justify-between space-x-2 bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm',
                                        chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700'
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    >
                                        <div className="flex items-center">
                                        <div className={cn("px-2 py-3 border-r border-r-slate-200 border-l-md transition hover:bg-slate-300"
                                            ,chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200'
                                        )}
                                        {...provided.dragHandleProps}
                                        >

                                            <Grip className="w-5 h-5"/>
                                        </div>
                                        {chapter.title}
                                        </div>
                                        
                                        <div  className=" ml-auto pr-2  flex items-center gap-x-2">
                                            { chapter.isFree && (
                                                    <Badge className="ml-auto">
                                                        Free
                                                    </Badge>
                                                )
                                            }
                                            <Badge className={cn(
                                                "bg-slate-500 ml-auto",
                                                chapter.isPublished && "bg-sky-700"
                                            )}>
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                            onClick={() => onEdit(chapter.id)}
                                            className="w-4 h-4 transition hover:opacity-75 cursor-pointer"
                                            />

                                        </div>

                                    </div>
                                )}
                            </Draggable>
                        ))
                    }
                  {provided.placeholder}
                </div>
            )

            }

         </Droppable>
    </DragDropContext>

  )
}
