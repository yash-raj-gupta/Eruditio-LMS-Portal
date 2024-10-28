"use client"

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
    courseId: string,
    chapterId: string,
    title: string,
    nextChapterId?: string,
    playbackId: string,
    isLocked: boolean,
    completeOnEnd: boolean
}

export const VideoPlayer = ({
    courseId,
    chapterId,
    title,
    nextChapterId,
    playbackId,
    isLocked,
    completeOnEnd
}:VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () => {
        try {
            if(completeOnEnd){
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                });
            }

            if(!nextChapterId){
                confetti.onOpen();
            }
            toast.success("Progress updated");
            router.refresh();

            if(nextChapterId){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

        } catch (error) {
            toast.error("Something went wrong");
        }
    }


      return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="flex inset-0 items-center justify-center absolute bg-slate-800">
                    <Loader2
                    className="w-8 h-8 animate-spin text-secondary"
                    />

                </div>
            ) }
            {isLocked && (
                <div className="absolute flex items-center justify-center inset-0 bg-slate-800 flex-col text-secondary gap-y-2">
                 <Lock className="w-8 h-8"/>
                 <p className="text-sm">
                    This chapter is locked
                 </p>

                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                title={title}
                className={cn(
                    !isReady && 'hidden'
                )}
                onCanPlay={() => setIsReady(true)}
                onEnded={onEnd}
                autoPlay
                playbackId={playbackId}
                />
            )}
        </div>
      )
}