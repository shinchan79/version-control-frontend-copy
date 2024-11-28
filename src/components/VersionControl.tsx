'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Tag as TagIcon, X, Edit2, Eye, ArrowUpDown, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Version, Tag } from "@/types/version";
import * as api from "@/lib/api";
import { PreviewModal } from "./PreviewModal";

export function VersionControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] = useState(false);
  const [isDiffDialogOpen, setIsDiffDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [compareVersionId, setCompareVersionId] = useState<number | null>(null);
  const [diffContent, setDiffContent] = useState<string>("");
  const [editingTag, setEditingTag] = useState<{tagName: string; newName: string} | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingVersions, setIsLoadingVersions] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoadingVersions(true);
    setError(null);
    
    try {
      const versionsData = await api.getVersions();
      const versionsWithTags = await Promise.all(
        versionsData.map(async (version) => {
          try {
            const tags = await api.getVersionTags(version.id);
            const tagsObject: { [key: string]: Tag } = {};
            tags.forEach(tag => {
              tagsObject[tag.name] = tag;
            });
            return { ...version, tags: tagsObject };
          } catch (error) {
            console.error(`Failed to fetch tags for version ${version.id}:`, error);
            return { ...version, tags: {} };
          }
        })
      );
      setVersions(versionsWithTags);
    } catch (error) {
      console.error('Error in fetchData:', error);
      const errorMessage = api.handleApiError(error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.createVersion(content, message);
      await fetchData();
      setIsOpen(false);
      setContent("");
      setMessage("");
      toast({
        title: "Success",
        description: "Version created successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (versionId: number) => {
    try {
      await api.publishVersion(versionId, "admin");
      await fetchData();
      toast({
        title: "Success",
        description: "Version published successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUnpublish = async (versionId: number) => {
    try {
      await api.unpublishVersion(versionId);
      await fetchData();
      toast({
        title: "Success",
        description: "Version unpublished successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRevert = async (versionId: number) => {
    setLoadingStates(prev => ({ ...prev, [versionId]: true }));
    try {
      await api.revertToVersion(versionId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchData();
      toast({
        title: "Success",
        description: "Reverted to version successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [versionId]: false }));
    }
  };

  const handleDelete = async (versionId: number) => {
    const version = versions.find(v => v.id === versionId);
    
    if (version?.status === 'published') {
      toast({
        title: "Error",
        description: "Cannot delete a published version. Please unpublish it first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.deleteVersion(versionId);
      await fetchData();
      toast({
        title: "Success",
        description: "Version deleted successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersionId) return;
    setIsLoading(true);
    try {
      await api.createTag(selectedVersionId, newTagName);
      await fetchData();
      setIsTagDialogOpen(false);
      setNewTagName("");
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setIsLoading(true);
    try {
      await api.updateTag(editingTag.tagName, editingTag.newName);
      await fetchData();
      setIsEditTagDialogOpen(false);
      setEditingTag(null);
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (versionId: number, tagName: string) => {
    try {
      await api.deleteTag(tagName);
      await fetchData();
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleShowDiff = async (versionId: number, compareId: number) => {
    try {
      const diff = await api.getDiff(versionId, compareId);
      setDiffContent(diff);
      setIsDiffDialogOpen(true);
    } catch (error) {
      const errorMessage = api.handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePreview = (versionId: number) => {
    setSelectedVersionId(versionId);
    setIsPreviewModalOpen(true);
  };

  const handleOpenInNewTab = (versionId: number) => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/preview/${versionId}`, '_blank');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Version Control</h2>
        <Button onClick={() => setIsOpen(true)}>Create New Version</Button>
      </div>

      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : isLoadingVersions ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={`version-${version.id}-${version.timestamp}`}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Version {version.id}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      version.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {version.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(version.timestamp).toLocaleString()}
                  </p>
                  {version.message && (
                    <p className="text-sm text-gray-600 mt-1">{version.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(version.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenInNewTab(version.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVersionId(version.id);
                      setCompareVersionId(version.id > 1 ? version.id - 1 : null);
                      handleShowDiff(version.id, version.id > 1 ? version.id - 1 : version.id);
                    }}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Compare
                  </Button>
                  {version.status === 'draft' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish(version.id)}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnpublish(version.id)}
                    >
                      Unpublish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevert(version.id)}
                    disabled={loadingStates[version.id]}
                  >
                    {loadingStates[version.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : null}
                    Revert
                  </Button>
                  {version.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(version.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {Object.values(version.tags || {}).map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <TagIcon size={14} />
                    <span>{tag.name}</span>
                    <button
                      onClick={() => {
                        setSelectedVersionId(version.id);
                        setEditingTag({ tagName: tag.name, newName: tag.name });
                        setIsEditTagDialogOpen(true);
                      }}
                      className="hover:text-blue-600 ml-1"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(version.id, tag.name)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={() => {
                    setSelectedVersionId(version.id);
                    setIsTagDialogOpen(true);
                  }}
                >
                  <TagIcon size={14} className="mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Version Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Version</DialogTitle>
              <DialogDescription>
                Create a new version of the content with your changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="content">Content</label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content here..."
                  className="h-32"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message">Commit Message</label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Brief description of changes"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateTag}>
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogDescription>
                Create a new tag for this version.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="tagName">Tag Name</label>
                <Input
                  id="tagName"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !newTagName.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Tag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditTagDialogOpen} onOpenChange={setIsEditTagDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditTag}>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>
                Update the tag name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="editTagName">Tag Name</label>
                <Input
                  id="editTagName"
                  value={editingTag?.newName || ""}
                  onChange={(e) => setEditingTag(prev => 
                    prev ? { ...prev, newName: e.target.value } : null
                  )}
                  placeholder="Enter new tag name"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !editingTag || !editingTag.newName.trim()}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Tag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diff Dialog */}
      <Dialog open={isDiffDialogOpen} onOpenChange={setIsDiffDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Version Comparison</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh]">
              {diffContent}
            </pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDiffDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        versionId={selectedVersionId}
        onOpenNewTab={handleOpenInNewTab}
      />
    </div>
  );
}