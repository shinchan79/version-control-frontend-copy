import { useState, useEffect } from 'react';
import { Version, CurrentVersion } from '@/types/version';
import { config, getEndpoint, getHeaders, formatError } from '@/config';

interface CreateVersionParams {
  content: string;
  message: string;
}

interface RevertVersionParams {
  versionId: number;
}

export const useVersions = () => {
  // States
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<CurrentVersion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch versions và current version
  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Parallel fetch cho cả versions và current version
      const [versionsResponse, currentResponse] = await Promise.all([
        fetch(getEndpoint('GET_VERSIONS', { id: config.DEFAULT_CONTENT_ID }), {
          headers: getHeaders()
        }),
        fetch(getEndpoint('GET_CURRENT', { id: config.DEFAULT_CONTENT_ID }), {
          headers: getHeaders()
        })
      ]);

      // Kiểm tra response status
      if (!versionsResponse.ok || !currentResponse.ok) {
        throw new Error(config.MESSAGES.ERROR.FETCH);
      }

      // Parse JSON data
      const [versionsData, currentData] = await Promise.all([
        versionsResponse.json(),
        currentResponse.json()
      ]);

      setVersions(versionsData);
      setCurrentVersion(currentData);
    } catch (err) {
      setError(formatError(err));
      console.error('Error fetching versions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo version mới
  const createVersion = async (params: CreateVersionParams) => {
    try {
      const response = await fetch(getEndpoint('CREATE'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(config.MESSAGES.ERROR.CREATE);
      }

      return await response.json();
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  // Cập nhật version
  const updateVersion = async (params: CreateVersionParams) => {
    try {
      const response = await fetch(
        getEndpoint('UPDATE', { id: config.DEFAULT_CONTENT_ID }), 
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(params)
        }
      );

      if (!response.ok) {
        throw new Error(config.MESSAGES.ERROR.UPDATE);
      }

      return await response.json();
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  // Revert về version cũ
  const revertVersion = async (params: RevertVersionParams) => {
    try {
      const response = await fetch(
        getEndpoint('REVERT', { id: config.DEFAULT_CONTENT_ID }), 
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(params)
        }
      );

      if (!response.ok) {
        throw new Error(config.MESSAGES.ERROR.REVERT);
      }

      return await response.json();
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  // Xóa version
  const deleteVersion = async (versionId: number) => {
    try {
      const response = await fetch(
        getEndpoint('DELETE', { 
          id: config.DEFAULT_CONTENT_ID, 
          versionId: versionId.toString() 
        }), 
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(config.MESSAGES.ERROR.DELETE);
      }

      return await response.json();
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  // Fetch data khi component mount
  useEffect(() => {
    fetchVersions();
  }, []);

  // Trả về states và functions
  return {
    // States
    versions,
    currentVersion,
    loading,
    error,
    
    // Actions
    refetch: fetchVersions,
    createVersion,
    updateVersion,
    revertVersion,
    deleteVersion
  };
};