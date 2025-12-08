"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase"; 
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator, 
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventSpacePage({ params }: PageProps) {
  const { id } = await params;
  const { data: eventSpace, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !eventSpace) {
    console.error("Error fetching facility:", error);
    return notFound(); 
  }

  return (
    <SidebarProvider> 
        <AppSidebar/>
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb >
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/authentication/dashboard" className= "text-black">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/authentication/eventspaces/${id}`} className= "text-black">
                    {eventSpace.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-[#EEF4ED] w-full min-h-screen p-10">
  <div className="flex flex-col w-full max-w-5xl mx-auto bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden">
    <div className="relative w-full h-[400px]">
      
      <Image
        src={eventSpace.image_url || '/placeholder.jpg'} 
        alt={eventSpace.title}
        fill 
        className="object-cover" 
      />

      <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full border border-emerald-400 text-sm font-medium shadow-sm">
        {eventSpace.is_active ? "Available now" : "Unavailable"}
      </div>

      <Link 
        href={`/authentication/reservation/${eventSpace.id}`}
        className="absolute bottom-4 right-4 bg-[#C5E0C7] hover:bg-[#b3dcb5] text-black px-6 py-2 font-bold border border-gray-400 shadow-md transition-colors rounded-lg"
      >
        RESERVE
      </Link>
    </div>

    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-700">{eventSpace.title}</h2>
      </div>


      <p className="text-slate-600 text-sm leading-relaxed">
        {eventSpace.description}
      </p>
    </div>

  </div>
</div>
    </SidebarInset>
    </SidebarProvider>  
)
}