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
import { usePathname } from "next/navigation";
import {  inviteUserToDocument } from "../../actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";

function InviteUser () {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState('');
    const pathName = usePathname();

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();
        const roomId = pathName.split("/").pop();
        if(!roomId) return;
        startTransition(async () => {
            const success = await inviteUserToDocument(roomId, email);
            if(success) {
                setIsOpen(false);
                setEmail("");
                toast.success('User added to room successfully')
            }
            else{
                toast.error('Failed to add user')
            }
        })
    }

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <div className="bg-gray-400 px-4 h-fit py-[6px] text-white rounded ">
                <DialogTrigger className="p-0 cursor-pointer">Invite</DialogTrigger>
            </div>
            <DialogContent className="bg-white">
                <DialogHeader>
                <DialogTitle>Invite a user to collaborate</DialogTitle>
                <DialogDescription>
                    Enter the email of the user you want to invite
                </DialogDescription>
                </DialogHeader>
                <form className="flex gap-2" onSubmit={handleInvite}>
                    <Input type="email"
                    placeholder="Email"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                    <button type="submit" disabled = {!email || isPending}>
                        {isPending ? 'Inviting...' : 'Invite'}
                    </button>
                </form>
                
            </DialogContent>
        </Dialog>
    )
}

export default InviteUser;