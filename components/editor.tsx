"use client"
//use client is not enough to stop server side rendering as atleast once it is run on the server side
import dynamic from "next/dynamic"
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";
//React quill helps us in making a text editor
interface EditorProps{
    onChange: (value: string) => void;
    value: string
};

export const Editor =({
    onChange,
    value,
}: EditorProps) => {
    // so here to stop it from being executed on the server side we have imported it in this way to avoid the hydration error
    const ReactQuill = useMemo(() => dynamic(() => import ('react-quill'), {ssr: false}), []);

    return (
        <div className="bg-white">
        <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        />
        </div>
    )

}