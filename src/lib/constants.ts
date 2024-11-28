export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://content-version-system.sycu-lee.workers.dev/';

export const API_ENDPOINTS = {
  // Content & Versions
  content: `${API_BASE}/content`,
  versions: `${API_BASE}/content/default/versions`,
  version: (id: number) => `${API_BASE}/content/default/versions/${id}`,
  publish: (id: number) => `${API_BASE}/content/default/versions/${id}/publish`,
  unpublish: (id: number) => `${API_BASE}/content/default/versions/${id}/unpublish`,
  revert: `${API_BASE}/content/default/revert`,
  diff: (fromId: number, toId: number) => 
    `${API_BASE}/content/default/versions/${fromId}/diff?compare=${toId}`,

  // Tags
  tags: `${API_BASE}/content/versions/tags`,
  versionTags: (versionId: number) => `${API_BASE}/content/versions/${versionId}/tags`,
  tag: (name: string) => `${API_BASE}/content/versions/tags/${name}`,

  // Publish History
  publishHistory: `${API_BASE}/content/default/publish-history`,
};