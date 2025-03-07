'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, DialogClose, DialogFooter
  } from "@/components/ui/dialog"
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "../../actions/actions";
import { toast } from "sonner";

function DeleteDocument () {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathName = usePathname();
    const router = useRouter();

    const handleDelete = async () => {
        const roomId = pathName.split("/").pop();
        if(!roomId) return;
        startTransition(async () => {
            const success = await deleteDocument(roomId);
            if(success) {
                setIsOpen(false);
                router.replace("/");
                toast.success('Room deleted successfully')
            }
            else{
                toast.error('Failed to delete room')
            }
        })
    }

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <button className="bg-red-500 p-3 text-white">
                <DialogTrigger>Delete</DialogTrigger>
            </button>
            <DialogContent className="bg-white">
                <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2">
                    <button type="button" className="bg-red-500 p-3 text-white"
                        onClick={handleDelete} disabled = {isPending}>
                            {isPending ? 'Deleting...' : 'Delete'}
                    </button>
                    <DialogClose asChild>
                        <button type="button" className="bg-gray-300 p-3 text-black">Close</button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDocument;