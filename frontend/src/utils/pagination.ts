export function getVisiblePages(activePage: number, totalPages: number): number[] {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (activePage < 3) {
    return [1, 2, 3, 4, 5];
  }

  if (activePage > totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    activePage - 2,
    activePage - 1,
    activePage,
    activePage + 1,
    activePage + 2,
  ];
}