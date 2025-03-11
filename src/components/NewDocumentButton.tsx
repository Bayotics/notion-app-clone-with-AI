'use client'
import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "../../actions/actions";
import { BookOpenText } from "lucide-react";

function NewDocumentButton () {
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const handleCreateNewDocument = () => {
        startTransition(async () => {
            const {docId} = await(createNewDocument());
            router.push(`/doc/${docId}`);
        })
    }
    return (
        <div className="bg-black rounded-sm text-white">
            <Button onClick={handleCreateNewDocument} disabled = {isPending} className="cursor-pointer">
               <BookOpenText /> {isPending ? 'Creating...' : 'New Document'}
            </Button>
        </div>
    )
}

export default NewDocumentButton;