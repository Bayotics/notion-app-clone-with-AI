'use client';

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Fragment } from "react";
import logo from '../images/capture.png';
import Image from "next/image";


function Breadcrumbs () {

    const path = usePathname();
    const segments = path.split("/");


    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <div></div>
                        <Image src= {logo} alt="logo" className="h-6 w-10"/>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                    if (!segment) return null;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;
                    return(
                        <Fragment key={segment}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>documents</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                            
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>

    )
}
export default Breadcrumbs