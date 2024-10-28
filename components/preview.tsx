"use client"
//use client is not enough to stop server side rendering as atleast once it is run on the server side
import dynamic from "next/dynamic"
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";
//React quill helps us in making a text editor
interface PreviewProps{
    value: string
};

export const Preview =({
    value,
}: PreviewProps) => {
    // so here to stop it from being executed on the server side we have imported it in this way to avoid the hydration error
    const ReactQuill = useMemo(() => dynamic(() => import ('react-quill'), {ssr: false}), []);

    return (
        <div className="bg-white">
        <ReactQuill
        theme="bubble"
        value={value}
        />
        </div>
    )

}