import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePurchaseOrder1699602809968
  implements MigrationInterface
{
  name = 'CreateTablePurchaseOrder1699602809968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_order" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "vendor_id" integer NOT NULL, "company_name" character varying, "company_address" character varying, "company_phone_number" character varying, "ppn" double precision, "ppn_unit" character varying, "pph" double precision, "pph_unit" character varying, "discount" double precision, "bank_name" character varying, "bank_account_number" character varying, "bank_account_houlders_name" character varying(64), "payment_term" integer, "payment_term_unit" character varying, "notes" text, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ad3e1c7b862f4043b103a6c8c60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order_history" ("id" SERIAL NOT NULL, "purchase_order_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_734bfddbb92e6dadfeef12377db" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "purchase_order_history" ADD CONSTRAINT "FK_3d06bf777d02afde645fc8ebdcb" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order_history" DROP CONSTRAINT "FK_3d06bf777d02afde645fc8ebdcb"`,
    );

    await queryRunner.query(`DROP TABLE "purchase_order_history"`);
    await queryRunner.query(`DROP TABLE "purchase_order"`);
  }
}
