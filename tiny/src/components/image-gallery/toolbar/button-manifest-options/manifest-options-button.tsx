import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ManifestOptionsButton = () => {

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground">
      <EllipsisVertical className="size-4" />
    </Button>
  );

}