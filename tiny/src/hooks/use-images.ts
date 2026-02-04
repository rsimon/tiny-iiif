import { useMutation, useQueryClient } from '@tanstack/react-query';

const remove = async (ids: string[]) =>
  fetch('/tiny/api/images', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete images');
    return res.json();
  });

export const useImages = () => {
  const queryClient = useQueryClient();

  const deleteImages = useMutation({
    mutationFn: (imageIds: string[]) => remove(imageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directory'] });
    }
  });

  return { 
    deleteImages: deleteImages.mutate,
    deleteImagesAsync: deleteImages.mutateAsync,
    isDeletingImages: deleteImages.isPending
  }

}