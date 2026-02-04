import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateManifestDialog } from './create-manifest-dialog';

export const CreateManifestButton = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onCreateNewManifest = () => setIsDialogOpen(true);

  return (
    <>
      <Button
        variant="outline"
        className="border-dashed bg-transparent"
        onClick={onCreateNewManifest}>
        <Plus className="size-4" />
        New Manifest
      </Button>

      <CreateManifestDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} />  
    </>
  )

}