import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableInvoce1700383615540 implements MigrationInterface {
  name = 'CreateTableInvoce1700383615540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "customer_id" integer NOT NULL, "company_name" character varying, "company_address" character varying, "company_phone_number" character varying, "ppn" double precision, "ppn_unit" character varying, "pph" double precision, "pph_unit" character varying, "discount" double precision, "bank_name" character varying, "bank_account_number" character varying, "bank_account_houlders_name" character varying(64), "payment_term" character varying, "payment_term_unit" character varying, "notes" text, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_history" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_177c3e485223573621ff7f57ac6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_invoice" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "invoice_id" integer NOT NULL, "customer_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_5a5c73a1aaca162469b8fdd6046" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "invoice_history" ADD CONSTRAINT "FK_4627106a3e19230e386b0a5e8f2" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_history" DROP CONSTRAINT "FK_4627106a3e19230e386b0a5e8f2"`,
    );

    await queryRunner.query(`DROP TABLE "project_invoice"`);
    await queryRunner.query(`DROP TABLE "invoice_history"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
  }
}
