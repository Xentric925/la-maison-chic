import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationProps = {
  page: number; // Current page
  totalPages: number; // Total number of pages
  baseUrl: string; // Base URL for redirection
  noQuestionMark?: boolean | undefined; //whether to add the query start to the baseURL
};

export default function PaginationComponent({
  page,
  totalPages,
  baseUrl,
  noQuestionMark,
}: PaginationProps) {
  const generatePageUrl = (pageNumber: number) =>
    `${baseUrl}${noQuestionMark ? '&' : '?'}page=${pageNumber}`;

  const renderPaginationLinks = () => {
    const links = [];

    // Always show page 1
    links.push(
      <PaginationItem key={1}>
        <PaginationLink href={generatePageUrl(1)} isActive={page === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Add ellipsis if current page is greater than 3
    if (page > 3) {
      links.push(
        <PaginationItem key='ellipsis-start'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show the previous, current, and next page around the current page
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1); // Exclude the last page for now
    for (let i = start; i <= end; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink href={generatePageUrl(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Add ellipsis if there are pages after the current range and before the last page
    if (page < totalPages - 2) {
      links.push(
        <PaginationItem key='ellipsis-end'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show the last page
    if (totalPages > 1) {
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={generatePageUrl(totalPages)}
            isActive={page === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return links;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          {page > 1 && (
            <PaginationPrevious
              href={generatePageUrl(page - 1)}
              disabled={page === 1}
            />
          )}
        </PaginationItem>

        {/* Page Links */}
        {renderPaginationLinks()}

        {/* Next Button */}
        <PaginationItem>
          {page < totalPages && (
            <PaginationNext href={generatePageUrl(page + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
