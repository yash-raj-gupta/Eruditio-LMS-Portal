import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async (
    {children,
        params
    } :
    {children : React.ReactNode,
        params: {courseId: string}
    }
) => {

    const {userId} = auth();

    if(!userId){
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy:{
                    position: 'asc'
                }
            }
            
        }
    });

    if(!course){
        return redirect('/');
    }

    const progressCount = await getProgress(userId, course.id);
  return (
    <div className="h-full">
        <div className="md:pl-80 h-[80px] fixed inset-y-0 w-full z-50 ">
            <CourseNavbar
            course={course}
            progressCount={progressCount}
            />
        </div>
        <div className="hidden md:flex inset-y-0 h-full w-80 flex-col fixed z-50">
          <CourseSidebar
          course={course}
          progressCount={progressCount}
          />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
          {children}
        </main>

    </div>
  )
}

export default CourseLayout
