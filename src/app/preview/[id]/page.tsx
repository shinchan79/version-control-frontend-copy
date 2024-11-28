import PreviewContent from '@/components/PreviewContent';

export default function PreviewPage({ params }: { params: { id: string } }) {
  return <PreviewContent id={params.id} />;
}

export async function generateStaticParams() {
  try {
    const response = await fetch('https://content-version-system.sycu-lee.workers.dev/content/default/versions');
    const versions = await response.json();
    return versions.map((version: any) => ({
      id: version.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}