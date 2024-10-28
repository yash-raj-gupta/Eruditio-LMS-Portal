"use client"

import { Category } from "@prisma/client"
import {
  FcEngineering,
  FcMusic,
  FcFilmReel,
  FcSportsMode,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcSalesPerformance
} from "react-icons/fc"
import { IconType } from "react-icons/lib"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Engineering": FcEngineering,
    "Music": FcMusic,
    "Filming": FcFilmReel,
    "Fitness": FcSportsMode,
    "Computer Science": FcMultipleDevices,
    "Photography": FcOldTimeCamera,
    "Accounting": FcSalesPerformance,
};


export const Categories = ({
    items
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {items.map((item)=> {
            return (
                <CategoryItem
                key={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value={item.id}   
                />
            )
          })}
        </div>
    )
}