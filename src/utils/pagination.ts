export class Pagination {
  static async pagination(total, page, perpage, url) {
    const next = parseInt(page) + 1;
    const prev = parseInt(page) - 1;
    const nextPage = `${url}?page=${next}&page_size=${perpage}`;
    const previous = page > 1 ? `${url}?page=${prev}&page_size=${perpage}` : '';
    return {
      total_data: total || 0,
      total_pages: Math.ceil(total / perpage), // get total page
      current_page: page,
      next_page: nextPage,
      previous_page: previous,
      next,
      previous: prev,
    };
  }
}
