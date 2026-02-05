import { Blocks, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AppHeader = () => {

  return (
    <header className="flex items-center px-4 py-3 gap-4 bg-linear-to-r border-b border-border from-slate-800 via-sky-950 to-slate-900">
      <div className="flex items-center gap-2.5">
        <Blocks className="size-8 -rotate-4 text-slate-500" strokeWidth={1.25} />
        <span className="font-semibold text-slate-100 text-3xl tracking-wide">
          tiny<span className="text-slate-400">.iiif</span>
        </span>
      </div>
      
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" 
            strokeWidth={1.5} />
          <Input 
            placeholder="Search..." 
            className="pl-10 py-5 border border-white/25 font-light bg-white/10 text-slate-400 placeholder:text-slate-400  placeholder:tracking-wide placeholder:font-light focus-visible:ring-white/25 focus-visible:border-white/40"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white rounded-full bg-white/15 hover:bg-white/30 hover:text-white">
          <User className="size-5" strokeWidth={1.25} />
        </Button>
      </div>
    </header>
  )

}