import { Info, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger
} from '@/components/ui/accordion';
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Fragment, useState } from 'react';

interface ManifestMetadataDialogProps {

  open: boolean;

  onOpenChange(open: boolean): void;

}

// Common rights URIs for IIIF manifests
const RIGHTS_OPTIONS = [
  { 
    group: 'Creative Commons',
    options: [
      { value: 'http://creativecommons.org/publicdomain/zero/1.0/', label: 'CC0 1.0 Universal (Public Domain)' },
      { value: 'http://creativecommons.org/licenses/by/4.0/', label: 'CC BY 4.0' },
      { value: 'http://creativecommons.org/licenses/by-sa/4.0/', label: 'CC BY-SA 4.0' },
      { value: 'http://creativecommons.org/licenses/by-nc/4.0/', label: 'CC BY-NC 4.0' },
      { value: 'http://creativecommons.org/licenses/by-nc-sa/4.0/', label: 'CC BY-NC-SA 4.0' },
      { value: 'http://creativecommons.org/licenses/by-nd/4.0/', label: 'CC BY-ND 4.0' },
      { value: 'http://creativecommons.org/licenses/by-nc-nd/4.0/', label: 'CC BY-NC-ND 4.0' },
    ]
  },
  {
    group: 'RightsStatements.org',
    options: [
      { value: 'http://rightsstatements.org/vocab/InC/1.0/', label: 'In Copyright' },
      { value: 'http://rightsstatements.org/vocab/InC-OW-EU/1.0/', label: 'In Copyright - EU Orphan Work' },
      { value: 'http://rightsstatements.org/vocab/InC-EDU/1.0/', label: 'In Copyright - Educational Use Permitted' },
      { value: 'http://rightsstatements.org/vocab/InC-NC/1.0/', label: 'In Copyright - Non-Commercial Use Permitted' },
      { value: 'http://rightsstatements.org/vocab/InC-RUU/1.0/', label: 'In Copyright - Rights-holder(s) Unlocatable or Unidentifiable' },
      { value: 'http://rightsstatements.org/vocab/NoC-CR/1.0/', label: 'No Copyright - Contractual Restrictions' },
      { value: 'http://rightsstatements.org/vocab/NoC-NC/1.0/', label: 'No Copyright - Non-Commercial Use Only' },
      { value: 'http://rightsstatements.org/vocab/NoC-OKLR/1.0/', label: 'No Copyright - Other Known Legal Restrictions' },
      { value: 'http://rightsstatements.org/vocab/NoC-US/1.0/', label: 'No Copyright - United States' },
      { value: 'http://rightsstatements.org/vocab/CNE/1.0/', label: 'Copyright Not Evaluated' },
      { value: 'http://rightsstatements.org/vocab/UND/1.0/', label: 'Copyright Undetermined' },
      { value: 'http://rightsstatements.org/vocab/NKC/1.0/', label: 'No Known Copyright' },
    ]
  }
];

export const ManifestMetadataDialog = (props: ManifestMetadataDialogProps) => {

  const [metadata, setMetadata] = useState([
    {
      label: { en: ['Creator'] },
      value: { en: [''] }
    }
  ]);

  const [rights, setRights] = useState('');

  const [requiredStatement, setRequiredStatement] = useState({
    label: { en: ['Attribution'] },
    value: { en: [''] }
  });

  const addMetadataEntry = () => {
    setMetadata([...metadata, {
      label: { en: [''] },
      value: { en: [''] }
    }]);
  }

  const removeMetadataEntry = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  }

  const updateMetadataLabel = (index: number, lang: string, value: string) => {
    const updated = [...metadata];

    if (!updated[index].label[lang])
      updated[index].label[lang] = [];
  
    updated[index].label[lang][0] = value;
    setMetadata(updated);
  }

  const updateMetadataValue = (index: number, lang: string, value: string) => {
    const updated = [...metadata];

    if (!updated[index].value[lang])
      updated[index].value[lang] = [];
    
    updated[index].value[lang][0] = value;
    setMetadata(updated);
  }

  const updateRequiredLabel = (lang: string, value: string) => {
    const updated = { ...requiredStatement };

    if (!updated.label[lang])
      updated.label[lang] = [];
  
    updated.label[lang][0] = value;
    setRequiredStatement(updated);
  }

  const updateRequiredValue = (lang: string, value: string) => {
    const updated = { ...requiredStatement };

    if (!updated.value[lang])
      updated.value[lang] = [];

    updated.value[lang][0] = value;
    setRequiredStatement(updated);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit metadata</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 text-sm">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-blue-900">
              All text values use language-tagged maps. Default language is 'en' (English).
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["metadata", "rights", "required"]} className="w-full">
            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span>Metadata</span>
                  <Badge variant="secondary" className="text-xs">
                    {metadata.length} {metadata.length === 1 ? 'entry' : 'entries'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Ordered list of descriptive information. Each entry has a label and value.
                  </p>

                  {metadata.map((entry, index) => (
                    <div key={index} className="bg-muted/50 border rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Entry {index + 1}</span>
                        {metadata.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMetadataEntry(index)}
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Label (en)</Label>
                          <Input
                            placeholder="e.g., Creator"
                            value={entry.label.en?.[0] || ''}
                            onChange={(e) => updateMetadataLabel(index, 'en', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Value (en)</Label>
                          <Input
                            placeholder="Enter value..."
                            value={entry.value.en?.[0] || ''}
                            onChange={(e) => updateMetadataValue(index, 'en', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addMetadataEntry}
                    variant="outline"
                    size="sm"
                    className="w-full h-9 border-dashed text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rights">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span>Rights</span>
                  {rights && <Badge variant="outline" className="text-xs text-green-600">✓</Badge>}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    License or rights statement from Creative Commons or RightsStatements.org.
                  </p>

                  <div className="space-y-2">
                    <Label className="text-xs">Rights Statement</Label>
                    <Select value={rights} onValueChange={setRights}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select a rights statement..." />
                      </SelectTrigger>
                      <SelectContent>
                        {RIGHTS_OPTIONS.map((group, idx) => 
                          group.group ? (
                            <Fragment key={idx}>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                                {group.group}
                              </div>
                              {group.options.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </Fragment>
                          ) : null                             
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {rights && (
                    <div className="bg-muted rounded border p-2">
                      <code className="text-xs break-all font-mono">{rights}</code>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="required">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span>Required Statement</span>
                  {(requiredStatement.label.en?.[0] || requiredStatement.value.en?.[0]) && (
                    <Badge variant="outline" className="text-xs text-green-600">✓</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Text that must be displayed when the resource is shown. Typically attribution.
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Label (en)</Label>
                      <Input
                        placeholder="e.g., Attribution"
                        value={requiredStatement.label.en?.[0] || ''}
                        onChange={(e) => updateRequiredLabel('en', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Value (en)</Label>
                      <Textarea
                        placeholder="Enter required text..."
                        value={requiredStatement.value.en?.[0] || ''}
                        onChange={(e) => updateRequiredValue('en', e.target.value)}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )

}