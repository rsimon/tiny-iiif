import { useCallback, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useManifest } from '@/hooks/use-manifest';
import type { Manifest } from '@/types';
import { LanguageMapEditor, MetadataEditor } from './editor-primitives';
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';

interface ManifestEditorContentProps {

  manifestId: string;

  onClose(): void;

}

export const ManifestEditorContent = (props: ManifestEditorContentProps) => {

  const { updateManifest, manifest } = useManifest(props.manifestId);

  const [draft, setDraft] = useState<Manifest>(manifest);

  useEffect(() => setDraft(manifest), [manifest]);

  const update = useCallback(
    <K extends keyof Manifest>(
      key: K,
      val: Manifest[K]
    ) => {
      setDraft(prev => ({ ...prev, [key]: val }));
    },
    []
  );

  const save = () => {
    updateManifest(draft).then(() => props.onClose());
  }

  const reset = () => setDraft(manifest);

  return draft && (
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
            variant="ghost"
            onClick={reset}>
            Reset
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={props.onClose}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={save}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
        </div>
      </DialogHeader>

      <div className="px-4 py-2">
        <Accordion type="single" className="space-y-2">
          <div>
            <LanguageMapEditor
              label="Label"
              description="The human-readable label for this manifest."
              value={draft.label}
              onChange={v => update('label', v)}/>
          </div>

          <div>
            <LanguageMapEditor
              label="Summary"
              description="A compact textual summary for search results or small screens."
              value={draft.summary}
              onChange={v => update('summary', v)}/>
          </div>

          <div>
            <MetadataEditor
              metadata={draft.metadata}
              onChange={m => update('metadata', m)} />
          </div>

          {/*
          <div>
            <LanguageMapEditor
              label="Required Statement"
              description="Attribution or copyright text that viewers must display."
              value={draft.requiredStatement}
              onChange={(v) => update('label', v)}/>
          </div>
          */}

          {/*
          <div>
            <LanguageMapEditor
              label="Rights"
              description="A Creative Commons or RightsStatements.org URI."
              value={draft.rights}
              onChange={(v) => update('label', v)}/>
          </div>
          */}

          {/*
          <div>
            <LanguageMapEditor
              label="Providers"
              description="Organizations or people that contributed to providing this resource."
              value={draft.provider}
              onChange={(v) => update('label', v)}/>
          </div>
          */}
        </Accordion>
      </div>

      <DialogFooter className="p-6 pt-0">
        <Button
          type="button"
          variant="ghost"
          onClick={reset}>
          Reset
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={props.onClose}>
          Cancel
        </Button>

        <Button
          type="button"
          onClick={save}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  )

}