import { CirclePlus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LanguageMap } from '../manifest-editor-types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LanguageMapEditorProps {
    
  description?: string;
  
  label: string;
  
  value: LanguageMap;

  multiline?: boolean;

  error?: string;

  onChange: (value: LanguageMap) => void;

}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'und', name: 'Unspecified' }
];

export function LanguageMapEditor(props: LanguageMapEditorProps) {

  const entries = Object.entries(props.value);

  const updateLang = (oldLang: string, newLang: string) => {
    const newMap: LanguageMap = {};

    for (const [k, v] of Object.entries(props.value)) {
      newMap[k === oldLang ? newLang : k] = v;
    }

    props.onChange(newMap);
  }

  const updateValue = (lang: string, idx: number, text: string) => {
    const newMap = { ...props.value };

    newMap[lang] = [...(newMap[lang] || [])];
    newMap[lang][idx] = text;

    props.onChange(newMap);
  }

  const addValueToLang = (lang: string) => {
    const newMap = { ...props.value };

    newMap[lang] = [...(newMap[lang] || []), ''];

    props.onChange(newMap);
  }

  const removeValueFromLang = (lang: string, idx: number) => {
    const newMap = { ...props.value };

    newMap[lang] = newMap[lang].filter((_, i) => i !== idx);
    if (newMap[lang].length === 0) delete newMap[lang];

    props.onChange(newMap);
  }

  const addLanguage = () => {
    const usedLangs = Object.keys(props.value);
    const next = LANGUAGES.find((l) => !usedLangs.includes(l.code))?.code || 'und';
    props.onChange({ ...props.value, [next]: [''] });
  }

  const removeLang = (lang: string) => {
    const newMap = { ...props.value };
    delete newMap[lang];
    props.onChange(newMap);
  }

  return (
    <AccordionItem
      value={props.label}
      className="border! border-transparent cursor-pointer
        hover:border-gray-300/70 hover:rounded-sm hover:bg-white/30 hover:border
        data-[state=open]:border-gray-300 data-[state=open]:rounded-sm data-[state=open]:bg-white data-[state=open]:border data-[state=open]:shadow-xs">
      <AccordionTrigger 
        className="space-y-0.5 p-4 cursor-pointer hover:no-underline">
        <div>
          <Label className="text-base font-medium">
            {props.label} 
          </Label>
          {props.description && (
            <p className="text-sm font-light text-muted-foreground">
              {props.description}
            </p> 
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-6 space-y-6">
        {entries.map(([lang, values]) => (
          <div key={lang} className="flex gap-2 items-start group">
            <div className="shrink-0">
              <Select
                value={lang}
                onValueChange={value => updateLang(lang, value)}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>

                <SelectContent>
                  {LANGUAGES.map(l => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              {values.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  {props.multiline ? (
                    <Textarea
                      value={val}
                      onChange={(e) => updateValue(lang, idx, e.target.value)}
                      rows={2}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                      placeholder={`${props.label} value...`}
                    />
                  ) : (
                    <Input
                      value={val}
                      onChange={(e) => updateValue(lang, idx, e.target.value)}
                      className="flex-1"
                      placeholder={`${props.label}...`}
                    />
                  )}

                  {values.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeValueFromLang(lang, idx)}>
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                size="sm"
                variant="link"
                onClick={() => addValueToLang(lang)}
                className="text-xs text-muted-foreground relative px-1.5 -mt-1">
                + Add value
              </Button>
            </div>

            {entries.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
                onClick={() => removeLang(lang)}>
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLanguage}
          className="text-muted-foreground text-xs relative top-1 -left-1">
          <CirclePlus />
          Add language
        </Button>

        {props.error && <p className="text-xs text-destructive font-medium">{props.error}</p>}
      </AccordionContent>
    </AccordionItem>
  )

}