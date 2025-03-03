'use client';

import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

function SidebarOption ({href, id}: {href: string, id: string}) {
    const [data] = useDocumentData(doc (db, "documents", id));
    const pathname = usePathname();
    const isActive = href.includes(pathname) && pathname !== "/";
    if(!data) return null;
    return (
        <Link href={href}
            className={`${isActive ?  "active-sidebar" : "border-gray-400"}
             mt-4`}
        >
            <p className="truncate p-2 rounded-sm sidebar-title-content text-black">{data.title}</p>
        </Link>
    )
}

export default SidebarOption;