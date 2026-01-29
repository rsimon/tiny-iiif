import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isSubDirectory, type APIListDirectoryResponse, type ImageMetadata, type SubDirectory } from '@/types';
import { useUIState } from './use-ui-state';

export const API_BASE = '/api';

const list = async (currentPage: number, limit: number, currentDirectory?: string): Promise<APIListDirectoryResponse> => {
  const offset = limit * (currentPage - 1);

  const url = currentDirectory 
    ? `${API_BASE}/dir?offset=${offset}&limit=${limit}&dir=${currentDirectory}`
    : `${API_BASE}/dir?offset=${offset}&limit=${limit}`

  return fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch images');
    return res.json() as Promise<APIListDirectoryResponse>;
  });
}

const addImages = async (folderId: string, imageIds: string[]) =>
  fetch(`${API_BASE}/dir/${folderId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      addImages: imageIds
    })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to move images');
    return res.json();
  })

export const useDirectory = () => {
  const queryClient = useQueryClient();

  const currentDirectory = useUIState(state => state.currentDirectory);
  const currentPage = useUIState(state => state.currentPage);
  const pageSize = useUIState(state => state.pageSize);

  const currentDirectoryId = isSubDirectory(currentDirectory) ? currentDirectory.id : undefined;

  const { data: { items = [], images = [], manifests = [] } = {}, error } = useQuery({
    queryKey: ['directory', currentDirectory, currentPage, pageSize],
    queryFn: () => list(currentPage, pageSize, currentDirectoryId),
    select: data => ({
      items: data.items,
      total: data.total,
      images: data.items.filter(i => i.type === 'image') as ImageMetadata[],
      manifests: data.items.filter(i => i.type === 'manifest') as SubDirectory[],
    })
  });

  const refreshDirectory = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  const moveImagesToFolder = (folder: SubDirectory, images: ImageMetadata[]) =>
    addImages(folder.id, images.map(i => i.id)).then(refreshDirectory);

  return {
    items,
    images, 
    manifests, 
    moveImagesToFolder,
    refreshDirectory
  }

}