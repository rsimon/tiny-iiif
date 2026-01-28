import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadButtonProps {

  onUpload(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const UploadButton = (props: UploadButtonProps) => {
  
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickUpload = () => inputRef?.current.click();

  return (
    <div>
      <Button 
        variant="ghost"
        onClick={onClickUpload}>
        <Upload className="size-4" />
        Upload Images
      </Button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={props.onUpload} />
    </div>
  )

}