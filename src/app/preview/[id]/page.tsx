import PreviewContent from '@/components/PreviewContent';
import { getVersions } from '@/lib/api';

export default function PreviewPage({ params }: { params: { id: string } }) {
  return <PreviewContent id={params.id} />;
}

export async function generateStaticParams() {
  try {
    const versions = await getVersions();
    return versions.map((version) => ({
      id: version.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}