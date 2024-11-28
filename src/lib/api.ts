import { Version, Tag, CreateVersionRequest, PublishVersionRequest, RevertVersionRequest, DiffResponse } from '@/types/version';

const API_BASE = 'https://content-version-system.trinhhaiyen79.workers.dev';

// Helper function to handle JSON parsing
async function parseJSON<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Invalid JSON response:', text);
    throw new Error('Invalid response format');
  }
}

// Version Management
export async function createVersion(content: string, message?: string): Promise<Version> {
  const response = await fetch(`${API_BASE}/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, message } as CreateVersionRequest)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to create version');
  }

  return parseJSON<Version>(response);
}

export async function getVersions(): Promise<Version[]> {
  const response = await fetch(`${API_BASE}/content/default/versions`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch versions');
  }

  return parseJSON<Version[]>(response);
}

export async function getVersion(id: number): Promise<Version> {
  const response = await fetch(`${API_BASE}/content/default/versions/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch version');
  }

  return parseJSON<Version>(response);
}

export async function deleteVersion(id: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/content/default/versions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to delete version');
  }

  return parseJSON<{ success: boolean; message: string }>(response);
}

// Publishing
export async function publishVersion(id: number, publishedBy: string): Promise<Version> {
  const response = await fetch(`${API_BASE}/content/default/versions/${id}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ publishedBy })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to publish version');
  }

  return parseJSON<Version>(response);
}

export async function unpublishVersion(id: number): Promise<Version> {
  const response = await fetch(`${API_BASE}/content/default/versions/${id}/unpublish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to unpublish version');
  }

  return parseJSON<Version>(response);
}

// Version Control
export async function revertToVersion(id: number): Promise<Version> {
  const response = await fetch(`${API_BASE}/content/default/revert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ versionId: id })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to revert to version');
  }

  return parseJSON<Version>(response);
}

export async function getDiff(fromVersionId: number, toVersionId: number): Promise<string> {
  const response = await fetch(
    `${API_BASE}/content/default/versions/${fromVersionId}/diff?compare=${toVersionId}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to get diff');
  }

  return response.text(); // Changed to text() since the response is plain text
}

// Tags
export async function createTag(versionId: number, name: string): Promise<Tag> {
  const response = await fetch(`${API_BASE}/content/versions/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ versionId, name })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to create tag');
  }

  return parseJSON<Tag>(response);
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_BASE}/content/versions/tags`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch tags');
  }

  return parseJSON<Tag[]>(response);
}

export async function getVersionTags(versionId: number): Promise<Tag[]> {
  const response = await fetch(`${API_BASE}/content/versions/${versionId}/tags`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch version tags');
  }

  return parseJSON<Tag[]>(response);
}

export async function updateTag(oldName: string, newName: string): Promise<Tag> {
  const response = await fetch(`${API_BASE}/content/versions/tags/${oldName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newName })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to update tag');
  }

  return parseJSON<Tag>(response);
}

export async function deleteTag(name: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/content/versions/tags/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to delete tag');
  }

  return parseJSON<{ success: boolean; message: string }>(response);
}

// Publish History
export async function getPublishHistory(): Promise<PublishRecord[]> {
  const response = await fetch(`${API_BASE}/content/default/publish-history`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch publish history');
  }

  return parseJSON<PublishRecord[]>(response);
}

// Error handling helper
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}