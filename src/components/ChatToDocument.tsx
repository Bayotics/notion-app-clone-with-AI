
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

import * as Y from 'yjs';
import { BotIcon, MessageCircleCode } from "lucide-react";
import { toast } from "sonner";
import Markdown from 'react-markdown';
import { Input } from "./ui/input";

function ChatToDocument ({doc} : {doc : Y.Doc}) {
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setIsSummary] = useState("");
    const [question, setQuestion] = useState("");
    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        setQuestion(input);
        startTransition (async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        documentData,
                        question : input
                    })
                }
            )
            if (res.ok){
                const {message} = await res.json();
                setInput("");
                setIsSummary(message);
                toast.success("Question answered successfully");
                console.log(summary)
                console.log(message);
                console.log(res)
            }
        })
    }

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <div className="bg-gray-600 p-3 text-white h-fit">
                <DialogTrigger className="flex gap-2 cursor-pointer">
                    <MessageCircleCode className="mr-2" />
                    AI Chat with Document
                </DialogTrigger>
            </div>
            <DialogContent className="bg-white">
                <DialogHeader>
                <DialogTitle className="">Chat to the document</DialogTitle>
                <DialogDescription className="mb-8">
                    Ask a question and chat to the document with AI
                </DialogDescription>
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
                    <Input type="text"
                        placeholder="e.g what is this about?"
                        className="w-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled = {!input || isPending}
                    className="cursor-pointer">
                        {isPending ? 'Asking...' : 'Ask'}
                    </button>
                </form>
                
            </DialogContent>
        </Dialog>
    )
}
export default ChatToDocument;