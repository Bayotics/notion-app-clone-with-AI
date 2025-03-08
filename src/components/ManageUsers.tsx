
'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog"
import { useState, useTransition } from "react";
import {  removeUserFromDocument } from "../../actions/actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import useOwner from "@/lib/useOwner";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";

function ManageUsers () {
    const {user} = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id))
    );
    const handleDelete = (userId : string) => {
        startTransition (async () => {
            if(!user) return;
            const success = await removeUserFromDocument(room.id, userId);
            if(success){
                toast.success("User removed from room successfully")
            }
            else{
                toast.error("Failed to remove user from room");
            }
        })
    }

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <div className="bg-gray-400 p-3 text-white">
                <DialogTrigger>Users({usersInRoom?.docs.length})</DialogTrigger>
            </div>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Users with Access</DialogTitle>
                    <DialogDescription>
                        Here is a list of users who have access to this document
                    </DialogDescription>
                </DialogHeader>
                <hr className="my-2" />
                <div className = "flex flex-col space-y-2">
                    {usersInRoom?.docs.map((doc) => (
                        <div key={doc.data().userId} className="flex items-center justify-between">
                            <p className="font-light">
                                {doc.data().userId === user?.emailAddresses[0].toString()
                                ? `You (${doc.data().userId})` : doc.data().userId}
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="bg-gray-200 text-black rounded-sm p-3">
                                    {doc.data().role}
                                </button>
                                {isOwner && 
                                    doc.data().userId !== user?.emailAddresses[0].toString() && (
                                        <button className="bg-red-500 text-white rounded-sm p-3"
                                        onClick={() => handleDelete(doc.data().userId)}
                                        disabled = {isPending}
                                        >
                                            {isPending ? 'Removing...' : "X"}
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ManageUsers;