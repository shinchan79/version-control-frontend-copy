'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { config } from '@/config';
import { Version } from '@/types/version';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as Diff from 'diff';

interface CompareViewProps {
  isOpen: boolean;
  onClose: () => void;
  fromVersionId: number | null;
  toVersionId: number | null;
}

export function CompareView({ isOpen, onClose, fromVersionId, toVersionId }: CompareViewProps) {
  const [fromVersion, setFromVersion] = useState<Version | null>(null);
  const [toVersion, setToVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diff, setDiff] = useState<Diff.Change[]>([]);
  const [stats, setStats] = useState<{ additions: number; deletions: number }>({
    additions: 0,
    deletions: 0,
  });

  useEffect(() => {
    const fetchVersions = async () => {
      if (!fromVersionId || !toVersionId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch both versions in parallel
        const [fromResponse, toResponse] = await Promise.all([
          fetch(`${config.API_URL}/content/default/versions/${fromVersionId}`, {
            headers: config.DEFAULT_HEADERS
          }),
          fetch(`${config.API_URL}/content/default/versions/${toVersionId}`, {
            headers: config.DEFAULT_HEADERS
          })
        ]);

        if (!fromResponse.ok || !toResponse.ok) {
          throw new Error('Failed to fetch versions');
        }

        const [fromData, toData] = await Promise.all([
          fromResponse.json(),
          toResponse.json()
        ]);

        setFromVersion(fromData);
        setToVersion(toData);

        // Calculate diff
        const differences = Diff.diffLines(fromData.content, toData.content);
        setDiff(differences);

        // Calculate stats
        let additions = 0;
        let deletions = 0;
        differences.forEach(part => {
          if (part.added) additions += part.count || 0;
          if (part.removed) deletions += part.count || 0;
        });
        setStats({ additions, deletions });

      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load versions');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && fromVersionId && toVersionId) {
      fetchVersions();
    }
  }, [isOpen, fromVersionId, toVersionId]);

  const renderDiffContent = () => {
    return diff.map((part, index) => {
      const backgroundColor = part.added 
        ? 'bg-green-100' 
        : part.removed 
          ? 'bg-red-100' 
          : 'bg-gray-50';
      const textColor = part.added 
        ? 'text-green-800' 
        : part.removed 
          ? 'text-red-800' 
          : 'text-gray-800';
      const borderColor = part.added 
        ? 'border-green-200' 
        : part.removed 
          ? 'border-red-200' 
          : 'border-gray-200';

      return (
        <div
          key={index}
          className={`${backgroundColor} ${textColor} p-2 border-l-4 ${borderColor} mb-1`}
        >
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {part.value}
          </pre>
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Compare Versions {fromVersionId} → {toVersionId}
          </DialogTitle>
          {fromVersion && toVersion && (
            <DialogDescription>
              <div className="mt-2 space-y-1 text-sm">
                <div>From: {fromVersion.message} ({new Date(fromVersion.timestamp).toLocaleString()})</div>
                <div>To: {toVersion.message} ({new Date(toVersion.timestamp).toLocaleString()})</div>
                <div className="flex gap-4 mt-2">
                  <span className="text-green-600">+{stats.additions} additions</span>
                  <span className="text-red-600">-{stats.deletions} deletions</span>
                </div>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : (
            <div className="space-y-1">
              {renderDiffContent()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}