'use client';

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import {useCollection} from "react-firebase-hooks/firestore"
import { useUser } from "@clerk/nextjs";
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SideBarOption";

interface RoomDocument extends DocumentData{
    createdAt: string;
    role: "owner" | "editor",
    roomId: string;
    userId: string
}

function SideBar() {
    const {user} = useUser();
    const [groupedData, setGroupedData] = useState <{
        owner: RoomDocument[],
        editor: RoomDocument[]
    }>({
        owner: [],
        editor: []
    })
    const [data] = useCollection(
        user && 
            query(collectionGroup(db, 'rooms'),
            where("userId", "==", user.emailAddresses[0].toString()))        
    );

    useEffect(() => {
        if(!data)
            return
        const grouped = data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (acc, curr) => {
                const roomData = curr.data() as RoomDocument;
                if (roomData.role === "owner"){
                    acc.owner.push({
                        id: curr.id,
                        ...roomData
                    })
                }
                else{
                    acc.editor.push({
                        id: curr.id,
                        ...roomData
                    })
                }
                return acc;
            }, {
                owner: [],
                editor: []
            }
        )
        setGroupedData(grouped);
    }, [data])
    const menuOptions = (
        <>
            <NewDocumentButton />
            <div>
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-gray-300 font-semibold text-sm">
                        No Document found
                    </h2>
                ) : (
                    <>
                        <h2 className=" font-semibold text-sm mt-6 mb-1 text-gray-300">
                            My Documents
                        </h2> 
                        {groupedData.owner.map((doc) => (
                            <SidebarOption key = {doc.id} id = {doc.id} 
                                href = {`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            
                {groupedData.editor.length > 0 && (
                    <>
                    <h2 className="text-gray-300 font-semibold text-sm mt-8">
                        Shared with me
                    </h2>
                    {groupedData.editor.map((doc) => (
                        <SidebarOption key = {doc.id} id = {doc.id} 
                        href = {`/doc/${doc.id}`} />
                    ))}
                    </>
                )}
            </div>
        </>
    )
    return(
        <div className="p-2 md:p-5 bg-gray-700 relative">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                    </SheetTrigger>
                    <SheetContent side = 'left'>
                        <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <div>{menuOptions}</div>
                        <div></div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
           
            <div className="hidden md:inline">
                {menuOptions}
            </div>
        </div>
    )
}
export default SideBar