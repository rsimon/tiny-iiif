import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUIState } from './use-ui-state';
import type { APIListImagesResponse } from '@/types';

export const API_BASE = '/api';

const list = async (currentPage: number, pageSize: number): Promise<APIListImagesResponse> =>
  fetch(`${API_BASE}/images?offset=${pageSize * (currentPage - 1)}&limit=${pageSize}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch images');
      return res.json() as Promise<APIListImagesResponse>;
    });

const remove = async (ids: string[]) =>
  fetch(`${API_BASE}/images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete images');
    return res.json();
  });

export const useImages = () => {
  const queryClient = useQueryClient();

  const currentPage = useUIState((state) => state.currentPage);
  const pageSize = useUIState((state) => state.pageSize);

  const { data: { images = [] } = {}, error } = useQuery({
    queryKey: ['images', currentPage, pageSize],
    queryFn: () => list(currentPage, pageSize)
  });

  const deleteImages = useMutation({
    mutationFn: (imageIds: string[]) => remove(imageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });

  return { 
    images, 
    error, 
    deleteImages: deleteImages.mutate,
    deleteImagesAsync: deleteImages.mutateAsync,
    isDeletingImages: deleteImages.isPending
  };
}