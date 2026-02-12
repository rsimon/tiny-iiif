import { useCallback, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageMapEditor } from './editor-primitives';
import { createDefaultDescriptiveProperties, type IIIFDescriptiveProperties } from './manifest-editor-types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';

interface ManifestEditorProps {

  open: boolean;

  onOpenChange(open: boolean): void;

}

export const ManifestEditor = (props: ManifestEditorProps) => {

  const [draft, setDraft] = useState<IIIFDescriptiveProperties>(
    createDefaultDescriptiveProperties()
  );

  const update = useCallback(
    <K extends keyof IIIFDescriptiveProperties>(
      key: K,
      val: IIIFDescriptiveProperties[K]
    ) => {
      setDraft((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  return (
    <Dialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="p-0 gap-0 min-w-11/12 bg-muted">
        <DialogHeader
          className="p-5 flex flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle>
              IIIF Manifest Editor
            </DialogTitle>

            <DialogDescription>
              Edit descriptive properties for your Presentation API 3.0 manifest
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost">
              Reset
            </Button>

            <Button
              type="button"
              variant="ghost">
              Cancel
            </Button>

            <Button
              type="button">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </DialogHeader>

        <div className="px-4 py-2">
          <Accordion type="multiple" className="space-y-2" defaultValue={[]}>
            <section className="bg-white border border-gray-300 rounded-sm shadow-sm">
              <LanguageMapEditor
                label="Label"
                description="The human-readable label for this manifest."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>

            <section className="border-b">
              <LanguageMapEditor
                label="Summary"
                description="A compact textual summary for search results or small screens."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>

            <section className="border-b">
              <LanguageMapEditor
                label="Metadata"
                description="Key-value pairs displayed to users."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>

            <section className="border-b">
              <LanguageMapEditor
                label="Required Statement"
                description="Attribution or copyright text that viewers must display."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>

            <section className="border-b">
              <LanguageMapEditor
                label="Rights"
                description="A Creative Commons or RightsStatements.org URI."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>

            <section>
              <LanguageMapEditor
                label="Providers"
                description="Organizations or people that contributed to providing this resource."
                value={draft.label}
                onChange={(v) => update('label', v)}/>
            </section>
          </Accordion>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            type="button"
            variant="ghost">
            Reset
          </Button>

          <Button
            type="button"
            variant="ghost">
            Cancel
          </Button>

          <Button
            type="button">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}