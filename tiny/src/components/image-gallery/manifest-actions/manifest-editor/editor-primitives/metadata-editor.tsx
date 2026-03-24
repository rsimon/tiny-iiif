import { CirclePlus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LabelValuePair } from '@/types';
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

interface MetadataEditorProps {

  metadata?: LabelValuePair[]; 

  onChange(metadata?: LabelValuePair[]): void;

}

export const MetadataEditor = (props: MetadataEditorProps) => {

  const metadata = props.metadata || [];

  const addMetadataEntry = () => {
    props.onChange([...metadata, {
      label: { en: [''] },
      value: { en: [''] }
    }]);
  }

  const updateMetadataLabel = (index: number, lang: string, value: string) => {
    const updated = [...metadata];

    if (!updated[index].label[lang])
      updated[index].label[lang] = [];
  
    updated[index].label[lang][0] = value;
    props.onChange(updated);
  }

  const updateMetadataValue = (index: number, lang: string, value: string) => {
    const updated = [...metadata];

    if (!updated[index].value[lang])
      updated[index].value[lang] = [];
    
    updated[index].value[lang][0] = value;
    props.onChange(updated);
  }

  const removeMetadataEntry = (index: number) =>
    props.onChange(metadata.filter((_, i) => i !== index));

  return (
    <AccordionItem 
      value="metadata"
      className="border! border-transparent cursor-pointer
        hover:border-gray-300/70 hover:rounded-sm hover:bg-white/30 hover:border
        data-[state=open]:border-gray-300 data-[state=open]:rounded-sm data-[state=open]:bg-white data-[state=open]:border data-[state=open]:shadow-xs">
      <AccordionTrigger 
        className="space-y-0.5 p-4 cursor-pointer hover:no-underline">
        <div>
          <Label className="text-base font-medium">
            Metadata
          </Label>
          <p className="text-sm font-light text-muted-foreground">
            Ordered list of descriptive information. Each entry has a label and value.
          </p>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-6 space-y-8">
        {props.metadata?.map((entry, index) => (
          <div className="flex gap-2">
            <div className="space-y-2 grow">
              <Label className="ml-0.5">Label</Label>
              <Input
                placeholder="e.g., Creator"
                value={entry.label.en?.[0] || ''}
                onChange={(e) => updateMetadataLabel(index, 'en', e.target.value)}
                className="h-9 text-sm" />
            </div>

            <div className="space-y-2 grow-3">
              <Label className="ml-0.5">Value</Label>
              <Input
                placeholder="Enter value..."
                value={entry.value.en?.[0] || ''}
                onChange={(e) => updateMetadataValue(index, 'en', e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {metadata.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className=" self-end size-9 shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
                onClick={() => removeMetadataEntry(index)}>
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addMetadataEntry}
          className="text-muted-foreground text-xs relative top-1 -left-1">
          <CirclePlus />
          Add Entry
        </Button>
      </AccordionContent>
    </AccordionItem>
  )

}