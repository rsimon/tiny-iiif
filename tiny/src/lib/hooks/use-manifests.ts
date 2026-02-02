
import { useCallback, useEffect } from 'react';
import { useImageStore } from '../store_old';
import type { Folder } from '../../types';

const API_BASE = '/api';

export function useManifests() {

  const store = useImageStore()
  
  const fetchManifests = useCallback(async () => {
    store._setLoadingManifests(true)
    
    try {
      const response = await fetch(`${API_BASE}/manifests`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch manifests')
      }
      
      const data = await response.json()
      
      // Transform manifests to folders
      const folders: Folder[] = [
        { id: 'root', name: 'All Images', parentId: null, order: 0 },
        ...data.manifests.map((manifest: any, index: number) => ({
          id: manifest.id,
          name: manifest.label,
          parentId: 'root',
          order: index + 1,
        }))
      ]
      
      store._setFolders(folders)
    } catch (error) {
      console.error('Error fetching manifests:', error)
    } finally {
      store._setLoadingManifests(false)
    }
  }, [store])
  
  const getManifest = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/manifests/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch manifest')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching manifest:', error)
      throw error
    }
  }, [])
  
  const saveManifest = useCallback(async (id: string, manifest: any) => {
    try {
      const response = await fetch(`${API_BASE}/manifests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, manifest }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save manifest')
      }
      
      const data = await response.json()
      
      // Refresh manifests list
      await fetchManifests()
      
      return data
    } catch (error) {
      console.error('Error saving manifest:', error)
      throw error
    }
  }, [fetchManifests])
  
  const deleteManifest = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/manifests/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete manifest')
      }
      
      // Remove from local state
      store._removeFolder(id)
    } catch (error) {
      console.error('Error deleting manifest:', error)
      throw error
    }
  }, [store])
  

  useEffect(() => {
    fetchManifests()
  }, []);
  
  return {
    folders: store.folders,
    isLoading: store.isLoadingManifests,
    currentFolderId: store.currentFolderId,
    
    // Actions
    fetchManifests,
    getManifest,
    saveManifest,
    deleteManifest,
    setCurrentFolder: store.setCurrentFolder,
  }
}