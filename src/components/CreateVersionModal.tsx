'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { config } from '@/config';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVersionCreated: () => void;
}

export function CreateVersionModal({
  isOpen,
  onClose,
  onVersionCreated
}: CreateVersionModalProps) {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch(
        `${config.API_URL}/content/default`,
        {
          method: 'POST',
          headers: config.DEFAULT_HEADERS,
          body: JSON.stringify({
            content: content.trim(),
            message: message.trim() || 'New version'
          })
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to create version');
      }

      toast({
        title: "Success",
        description: "New version created successfully",
      });

      // Reset form and close modal
      setContent('');
      setMessage('');
      onVersionCreated();
      onClose();

    } catch (error) {
      console.error('Error creating version:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create version",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setContent('');
      setMessage('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className="min-h-[200px]"
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Commit Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Brief description of changes"
              disabled={isCreating}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !content.trim()}
          >
            {isCreating && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Version
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}