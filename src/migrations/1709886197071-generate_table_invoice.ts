import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableInvoice1709886197071 implements MigrationInterface {
  name = 'GenerateTableInvoice1709886197071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "project_id" integer, "code" character varying NOT NULL, "customer_id" integer NOT NULL, "company_name" character varying, "company_address" character varying, "company_phone_number" character varying, "ppn" double precision, "ppn_unit" character varying, "pph" double precision, "pph_unit" character varying, "discount" double precision, "bank_name" character varying, "bank_account_number" character varying, "bank_account_houlders_name" character varying(64), "payment_term" character varying, "payment_term_unit" character varying, "notes" text, "status" character varying, "type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "delivery_date" TIMESTAMP WITH TIME ZONE, "grand_total" double precision, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_history" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_177c3e485223573621ff7f57ac6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_status" ("id" SERIAL NOT NULL, "invoice" integer NOT NULL, "status_desc" character varying, "status" character varying, "reason" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f11609bd2829da2559c7cb72cbc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_detail" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "item" character varying, "quantity" integer, "unit" character varying, "unit_price" double precision, "sub_total" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_3d65640b01305b25702d2de67c4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoice_detail"`);
    await queryRunner.query(`DROP TABLE "invoice_status"`);
    await queryRunner.query(`DROP TABLE "invoice_history"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
  }
}
