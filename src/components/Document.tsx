'use client'
import { FormEvent, useEffect, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Document ({id} : {id: string}) {
    const [data] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();

    useEffect(() => {
        if(data){
            setInput(data.title);
        }
    }, [data])
    const updateTitle = (e: FormEvent) => {
        e.preventDefault();
        if(input.trim()){
            startTransition(async() => {
                await(updateDoc(doc(db, "documents", id), {
                    title: input
                }))
            })
        }
    }
    return (
        <div>
            <div>
                <form className="flex gap-4" onSubmit={updateTitle}>
                    <Input value = {input} onChange={(e) => setInput(e.target.value)} />
                    <Button disabled = {isUpdating} type = "submit" className="bg-black text-white">
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Document