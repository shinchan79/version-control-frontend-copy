'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { config, buildUrl, formatEndpoint } from '@/config';
import { Version } from '@/types/version';

export default function PreviewContent({ id }: { id: string }) {
  const [version, setVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const endpoint = formatEndpoint(config.ENDPOINTS.GET_VERSION, {
          id: config.DEFAULT_CONTENT_ID,
          versionId: id
        });
        
        const response = await fetch(buildUrl(endpoint), {
          headers: config.DEFAULT_HEADERS,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Version not found');
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch version: ${errorText}`);
        }

        const data = await response.json();
        setVersion(data);
      } catch (error) {
        console.error('Error fetching version:', error);
        setError(error instanceof Error ? error.message : 'Failed to load version');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600">Version not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Preview Version {version.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {version.message}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              version.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {version.status}
            </span>
            {version.publishedAt && (
              <p className="text-xs text-gray-400">
                Published by {version.publishedBy} at {new Date(version.publishedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
            {version.content}
          </pre>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Version {version.id} • {new Date(version.timestamp).toLocaleString()}
            </div>
            <div>
              Content Version System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}