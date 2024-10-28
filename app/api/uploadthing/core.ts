import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const handleAuth = async () => {
    const {userId } = auth();
    const isAuthorized = isTeacher(userId);
    if(!userId || !isAuthorized) 
        {
            throw new UploadThingError("Unauthorized");
        }

    return {userId};

} 

export const ourFileRouter: FileRouter = {
    courseImage: f({ image: {maxFileSize: '4MB', maxFileCount: 1}})
               .middleware(() => handleAuth())
               .onUploadComplete(() => {
                console.log('success')
                }),
    courseAttachment: f(['text', "image", "video", "audio", 'pdf'])
                 .middleware(() => handleAuth())
                 .onUploadComplete(()=> { }),
    chapterVideo: f({ video: {maxFileCount: 1, maxFileSize: '128GB'}})
                .middleware(() => handleAuth())
                .onUploadComplete(() => { })
  
} ;
 
export type OurFileRouter = typeof ourFileRouter;