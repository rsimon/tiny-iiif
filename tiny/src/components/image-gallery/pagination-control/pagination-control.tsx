import { useDirectory } from '@/hooks/use-directory';
import { useUIState } from '@/hooks/use-ui-state';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useCallback, useMemo } from 'react';

interface PaginationControlProps {
  className?: string;
}

type PaginationItem = 
  | { type: 'previous'; disabled: boolean }
  | { type: 'page'; pageNumber: number; isCurrent: boolean }
  | { type: 'ellipsis' }
  | { type: 'next'; disabled: boolean };

export const PaginationControl = (props: PaginationControlProps) => {
  const pageSize = useUIState(state => state.pageSize);
  
  const currentPage = useUIState(state => state.currentPage);
  const setCurrentPage = useUIState(state => state.setCurrentPage);
  
  const { data } = useDirectory();

  const totalPages = Math.ceil((data?.total || 0) / pageSize);  

  const computeItems = useCallback(() => {
    const items: PaginationItem[] = [];

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    // 2-5 pages - show all pages, no ellipsis
    if (totalPages <= 5) {
      items.push({ type: 'previous', disabled: isFirstPage });
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: 'page', pageNumber: i, isCurrent: i === currentPage });
      }
      items.push({ type: 'next', disabled: isLastPage });
      return items;
    }

    // 6+ pages: show first, last, current +/- 2, with ellipses for gaps
    items.push({ type: 'previous', disabled: isFirstPage });

    // Fix: Ensure startPage and endPage don't include 1 or totalPages
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
   
    // Always show page 1
    items.push({ type: 'page', pageNumber: 1, isCurrent: currentPage === 1 });

    // Add ellipsis if there's a gap after page 1
    if (startPage > 2)
      items.push({ type: 'ellipsis' });

    // Add the range of pages (now guaranteed not to include 1 or totalPages)
    for (let i = startPage; i <= endPage; i++) {
      items.push({ type: 'page', pageNumber: i, isCurrent: i === currentPage });
    }

    // Add ellipsis if there's a gap before last page
    if (endPage < totalPages - 1)
      items.push({ type: 'ellipsis' });

    // Always show last page
    items.push({ type: 'page', pageNumber: totalPages, isCurrent: currentPage === totalPages });

    items.push({ type: 'next', disabled: isLastPage });
    
    return items;
  }, [currentPage, totalPages]);

  const goTo = (item: PaginationItem) => (e: React.MouseEvent) => {
    e.preventDefault();

    if (item.type === 'previous' && !item.disabled && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (item.type === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (item.type === 'page') {
      setCurrentPage(item.pageNumber);
    }
  }

  const items = useMemo(() => computeItems(), [computeItems]);

  return totalPages > 1 ? (
    <Pagination className={props.className}>
      <PaginationContent>
        {items.map((item, index) => (
          item.type === 'previous' ? (
            <PaginationItem key="prev">
              <PaginationPrevious
                href="#"
                onClick={goTo(item)}
                aria-disabled={item.disabled}
                className={item.disabled ? 'pointer-events-none opacity-50' : ''} />
            </PaginationItem>
          ) : item.type === 'next' ? (
            <PaginationItem key="next">
              <PaginationNext 
                href="#" 
                onClick={goTo(item)}
                aria-disabled={item.disabled}
                className={item.disabled ? 'pointer-events-none opacity-50' : ''} />
            </PaginationItem>
          ) : item.type === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.pageNumber}>
              <PaginationLink 
                href="#" 
                onClick={goTo(item)}
                isActive={item.isCurrent}>
                {item.pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
      </PaginationContent>
    </Pagination>
  ) : null;
  
}