
'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import * as Y from 'yjs';
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from 'react-markdown';


type Language = 
    | "english"
    | "spanish"
    | "portuguese"
    | "french"
    | "german"
    | "arabic"
    | "hindi"
    | "russian"
    | "japanese"

    const languages : Language[] = ["arabic", "english", "french", "german", 
        "hindi", "japanese", "portuguese","russian", "spanish"];

function TranslateDocument ({doc} : {doc : Y.Doc}) {
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setIsSummary] = useState("");
    const [question, setQuestion] = useState("");
    const [language, setLanguage] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        startTransition (async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        documentData,
                        targetLang : language
                    })
                }
            )
            if (res.ok){
                const {translated_text} = await res.json();
                setIsSummary(translated_text);
                toast.success("Translated summary successfully");
                console.log(summary)
                console.log(translated_text);
                console.log(res)
            }
        })
    }

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <div className="bg-gray-400 p-3 text-white">
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate with AI
                </DialogTrigger>
            </div>
            <DialogContent className="bg-white">
                <DialogHeader>
                <DialogTitle className="">Translate the document</DialogTitle>
                <DialogDescription>
                    Select a language and AI will translate a summary of the document in the selected language
                </DialogDescription>
                <hr className="mt-5" />
                {question && <p className="mt-5 text-gray-500">
                                Q : {question}     
                            </p>
                }
                </DialogHeader>
                {summary && (
                    <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                        <div className="flex">
                            <BotIcon className="w-10 flex-shrink-0" />
                            <p className="font-bold">
                                GPT {isPending ? 'is thinking...' : 'says'}
                            </p>
                        </div>
                        <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
                    </div>
                )}
                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Select
                        
                        value={language}
                        onValueChange={(value) => setLanguage(value)}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder = "select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <button type="submit" disabled = {!language || isPending}>
                        {isPending ? 'Translating...' : 'Translate'}
                    </button>
                </form>
                
            </DialogContent>
        </Dialog>
    )
}
export default TranslateDocument;