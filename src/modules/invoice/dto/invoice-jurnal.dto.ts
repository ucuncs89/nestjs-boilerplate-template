export class PostCustomerJurnalDto {
  title?: string;
  first_name?: string;
  display_name?: string;
  associate_company?: string;
  billing_address?: string;
  address?: string;
  phone?: string;
  email?: string;
  source: string;
}
export class PostProductJurnalDto {
  name: string;
  unit_name: string;
  buy_price_per_unit: string;
  sell_price_per_unit: string;
  product_code: string;
}

export class TransactionLinesAttributesDto {
  quantity: number;
  rate: number;
  discount?: number;
  product_name: string;
  line_tax_id?: number;
  line_tax_name?: string;
}
export class PostSalesQuoteJurnalDto {
  transaction_date: string;
  transaction_lines_attributes: TransactionLinesAttributesDto[];
  address?: string;
  due_date?: string;
  transaction_no?: string;
  person_name: string;
  email?: string;
}
