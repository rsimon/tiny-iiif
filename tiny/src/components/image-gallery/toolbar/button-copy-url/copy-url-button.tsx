import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Clipboard, ClipboardCheck, Link } from 'lucide-react';

interface CopyURLButtonProps {

  url: string;

}

export const CopyURLButton = (props: CopyURLButtonProps) => {

  const [copied, setCopied] = useState(false);

  const onClick = () => {
    try {
      navigator.clipboard.writeText(props.url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="cursor-pointer inline-flex text-muted-foreground hover:text-slate-950 items-center justify-center transition-colors"
          aria-label="Copy manifest URL">
          {copied ? (
            <ClipboardCheck className="size-4" />
          ) : (
            <Clipboard className="size-4" />
          )}
        </button>
      </TooltipTrigger>

      <TooltipContent>
        <p>Copy manifest URL</p>
      </TooltipContent>
    </Tooltip>
  )

}