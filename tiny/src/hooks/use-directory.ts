import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUIState } from './use-ui-state';
import { 
  isImage,
  isSubFolder, 
  type ImageMetadata, 
  type ListDirectoryResponse, 
  type SubFolder 
} from '@/types';

const list = async (currentPage: number, limit: number, currentDirectory?: string): Promise<ListDirectoryResponse> => {
  const offset = limit * (currentPage - 1);

  const url = currentDirectory 
    ? `/tiny/api/dir?offset=${offset}&limit=${limit}&dir=${currentDirectory}`
    : `/tiny/api/dir?offset=${offset}&limit=${limit}`

  return fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch images');
    return res.json() as Promise<ListDirectoryResponse>;
  });
}

const moveImages = async (folderId: string, imageIds: string[]) =>
  fetch(`/tiny/api/dir/${folderId}`, {
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

  const currentDirectoryId = isSubFolder(currentDirectory) ? currentDirectory.id : undefined;

  const { data: { items = [], images = [], folders = [] } = {}, error } = useQuery({
    queryKey: ['directory', currentDirectory, currentPage, pageSize],
    queryFn: () => list(currentPage, pageSize, currentDirectoryId),
    select: data => ({
      items: data.items,
      total: data.total,
      images: data.items.filter(i => isImage(i)),
      folders: data.items.filter(i => isSubFolder(i))
    })
  });

  const refreshDirectory = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  const moveImagesToFolder = (folder: SubFolder, images: ImageMetadata[]) =>
    moveImages(folder.id, images.map(i => i.id)).then(refreshDirectory);

  const isEmpty = useMemo(() => {
    return (images.length + folders.length) === 0;
  }, [images, folders]);

  return {
    images, 
    folders, 
    isEmpty,
    moveImagesToFolder,
    refreshDirectory
  }

}