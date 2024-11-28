'use client';

import { useEffect, useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Version, Tag } from '@/types/version';  // Sửa import path
import * as api from '@/lib/api';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: number | null;
  onOpenNewTab: (versionId: number) => void;
}

export function PreviewModal({ isOpen, onClose, versionId, onOpenNewTab }: PreviewModalProps) {
  const [version, setVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      if (!versionId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getVersion(versionId);
        setVersion(data);
      } catch (err) {
        console.error('Error:', err);
        const errorMessage = api.handleApiError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && versionId) {
      fetchVersion();
    } else {
      setVersion(null);
      setError(null);
    }
  }, [isOpen, versionId]);

  const renderTags = () => {
    if (!version?.tags || Object.keys(version.tags).length === 0) {
      return null;
    }
  
    return (
      <div className="flex items-center gap-2">
        <span>Tags:</span>
        <div className="flex flex-wrap gap-1">
          {Object.entries(version.tags).map(([key, tag]) => (
            <span 
              key={key}
              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {tag.tagName}  {/* Sửa từ tag.name thành tag.tagName */}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle>Preview Version {versionId}</DialogTitle>
            {versionId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenNewTab(versionId)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
            )}
          </div>
          
          {version && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  version.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {version.status}
                </span>
                <span>Created at: {new Date(version.timestamp).toLocaleString()}</span>
              </div>
              
              <div>Message: {version.message}</div>
              
              {version.publishedAt && version.publishedBy && (
                <div>
                  Published by {version.publishedBy} at {new Date(version.publishedAt).toLocaleString()}
                </div>
              )}
              
              {renderTags()}
            </div>
          )}

          {error && (
            <DialogDescription>
              <div className="text-red-500">{error}</div>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : version ? (
            <pre className="whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">
              {version.content}
            </pre>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}