import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderAndCreateTablePurchaseOrderDetail1708435546872
  implements MigrationInterface
{
  name =
    'AlterTablePurchaseOrderAndCreateTablePurchaseOrderDetail1708435546872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_order_detail" ("id" SERIAL NOT NULL, "purchase_order_id" integer NOT NULL, "relation_id" integer, "item" character varying, "quantity" integer, "unit" character varying, "unit_price" double precision, "sub_total" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_51029a6e129ce3c436c352f1a76" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "purchase_order" DROP COLUMN "type"`);

    await queryRunner.query(`DROP TABLE "purchase_order_detail"`);
  }
}
