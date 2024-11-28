// Cấu hình chính
export const config = {
  // API URL - đường dẫn tới backend service
  API_URL: "https://content-version-system.sycu-lee.workers.dev/",
  
  // ID mặc định cho content
  DEFAULT_CONTENT_ID: "default",
  
  // Các endpoints của API
  ENDPOINTS: {
    // Content management
    CREATE: "/content",
    GET_CURRENT: "/content/{id}",
    UPDATE: "/content/{id}",
    
    // Version management
    GET_VERSIONS: "/content/{id}/versions",
    GET_VERSION: "/content/{id}/versions/{versionId}",
    DELETE_VERSION: "/content/{id}/versions/{versionId}",
    REVERT: "/content/{id}/revert",
    
    // Publishing
    PUBLISH: "/content/{id}/versions/{versionId}/publish",
    GET_PUBLISH_HISTORY: "/content/{id}/publish-history",
    
    // Diff & Compare
    GET_DIFF: "/content/{id}/versions/{versionId}/diff",
    COMPARE_VERSIONS: "/content/{id}/versions/{versionId}/diff?compare={compareId}",
    
    // Tags
    CREATE_TAG: "/content/{id}/tags",
    GET_TAGS: "/content/{id}/tags",
    DELETE_TAG: "/content/{id}/tags/{tagName}"
  },
  
  // Các headers mặc định cho API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Fetch configurations
  FETCH_CONFIG: {
    static: {
      revalidate: 10,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    },
    dynamic: {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  },
  
  // Các settings khác
  SETTINGS: {
    MAX_CONTENT_LENGTH: 1000000, // 1MB
    MAX_MESSAGE_LENGTH: 500,
    MAX_TAG_LENGTH: 50,
    MAX_VERSIONS_PER_PAGE: 20
  }
} as const;

// Helper function để lấy headers
export function getHeaders(additionalHeaders: HeadersInit = {}): HeadersInit {
  return {
    ...config.DEFAULT_HEADERS,
    ...additionalHeaders
  };
}

// Helper function để lấy fetch config
export function getFetchConfig(type: 'static' | 'dynamic' = 'static'): RequestInit {
  return {
    headers: getHeaders(config.FETCH_CONFIG[type].headers),
    ...(type === 'static' 
      ? { next: { revalidate: config.FETCH_CONFIG.static.revalidate } }
      : { cache: 'no-store' })
  };
}

// Helper function để format error messages
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Helper function để replace path parameters
export function formatEndpoint(endpoint: string, params: Record<string, string | number>): string {
  let formattedEndpoint = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    formattedEndpoint = formattedEndpoint.replace(`{${key}}`, String(value));
  });
  return formattedEndpoint;
}

// Helper function để build full URL
export function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const formattedEndpoint = formatEndpoint(endpoint, params);
  return `${config.API_URL}${formattedEndpoint}`;
}

// Helper function để validate input
export function validateInput(input: string, maxLength: number): boolean {
  return input.length <= maxLength;
}

export function getStaticConfig(): RequestInit {
  return {
    headers: getHeaders(),
    next: { revalidate: 60 } // Cache trong 60 giây
  };
}

// Export default config
export default config;