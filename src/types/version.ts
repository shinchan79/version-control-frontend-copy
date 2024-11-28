export type VersionStatus = 'draft' | 'published';

export interface Version {
  id: number;
  content: string;
  timestamp: string;
  message: string;  // Removed optional since API always returns this
  status: VersionStatus;
  diff: {          // Removed optional since API always returns this
    from: string;
    to: string;
    changes: string;  // Changed type to match API response
    patch: string;
    hunks: any[];
  };
  publishedBy?: string;
  publishedAt?: string;
  tags?: { [key: string]: Tag };  // Changed to match API response format
}

export interface VersionDiff {
  added: string[];
  removed: string[];
  unchanged: string[];
}

export interface PublishHistory {
  versionId: number;
  publishedBy: string;
  publishedAt: string;
}

export interface Tag {
  tagName: string;    // Changed from 'name' to match API
  versionId: number;
  createdAt?: string; // Made optional as it might not always be present
}

export interface ContentState {
  currentVersion: number;
  versions: Version[];
  content: string | null;
  publishHistory?: PublishHistory[];
  tags?: { [key: string]: Tag };
}

export interface CreateVersionRequest {
  content: string;
  message?: string;
}

export interface RevertVersionRequest {
  versionId: number;
}

export interface PublishVersionRequest {
  publishedBy: string;
}

export interface CreateTagRequest {
  versionId: number;
  tagName: string;
}

export interface DiffResponse {
  from: string;
  to: string;
  changes: string;  // Changed type to match API response
  patch: string;
  hunks: any[];
}

// Response wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface VersionResponse extends ApiResponse<Version> {}
export interface VersionListResponse extends ApiResponse<Version[]> {}
export interface PublishHistoryResponse extends ApiResponse<PublishHistory[]> {}
export interface TagResponse extends ApiResponse<Tag> {}
export interface TagListResponse extends ApiResponse<{ [key: string]: Tag }> {}

// Success responses
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// Error responses
export interface ErrorResponse {
  error: string;
  status?: number;
}