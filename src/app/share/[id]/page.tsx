import { Metadata } from "next";
import { ShareDownload } from "@/components/share/share-download";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download File - Graphite",
    description: "Download shared file from Graphite - blazing fast cloud storage",
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <ShareDownload shareId={id} />
    </main>
  );
}
