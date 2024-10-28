import { Category, Course } from "@prisma/client"
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course &{
    category: Category | null;
    chapters: {id: string}[];
    progress: number| null;
}

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}


export const CoursesList = ({items}: CoursesListProps) => {
  return (
    <div className="">

    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4    ">
        {items.map((item) => (
            <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!} // we are using the ! to remove the ts errors as we know that the card will only be rendered when it will have all the fields
            chaptersLength={item.chapters.length}
            progress={item.progress}
            price={item.price!}
            category={item?.category?.name!}
            />
        ))}
    </div>
    {items.length ===0 && 
    <div className="text-sm text-center text-muted-foreground
     mt-10">
        No courses Found
    </div>
    }
    </div>
  )
}