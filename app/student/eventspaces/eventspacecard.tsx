import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface EventspaceCardProps{
  title: string;
  imageSrc: string;
  id: string;
}

export function EventspaceCard({ title, imageSrc, id }: EventspaceCardProps) {
  return (
    <Link href={`/student/eventspaces/${id}`} className="aspect-square rounded-xl w-full h-full block">
      <Card className="bg-[#556378] flex-col w-full h-full items-center justify-center flex rounded-xl px-4 pb-4 pt-0 hover:bg-[#4a5568] relative overflow-hidden transition-colors">
        <CardHeader className="w-full h-55 absolute top-0 p-0! rounded-t-xl overflow-hidden z-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="rounded-t-xl object-cover"
          />
        </CardHeader>
        <CardContent className="text-white font-bold text-2xl pt-55 text-center z-10 relative">
          {title}
        </CardContent>
      </Card>
    </Link>
  );
}