import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewManifestDialog } from './new-manifest-dialog';

export const NewManifestButton = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onCreateNewManifest = () => setIsDialogOpen(true);

  return (
    <>
      <Button
        onClick={onCreateNewManifest}>
        <Plus className="size-4" />
        New Manifest
      </Button>

      <NewManifestDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} />  
    </>
  )

}