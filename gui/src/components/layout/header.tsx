import { Cloud, Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 flex items-center px-4 gap-4">
      <div className="flex items-center gap-2 text-white">
        <Cloud className="size-6" />
        <span className="font-semibold text-lg">CloudGallery</span>
      </div>
      
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search images..." 
            className="pl-10 bg-white/90 border-0 focus-visible:ring-white/50"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Bell className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <User className="size-5" />
        </Button>
      </div>
    </header>
  )

}