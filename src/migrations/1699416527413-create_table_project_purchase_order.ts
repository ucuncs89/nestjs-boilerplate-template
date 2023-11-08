import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPurchaseOrder1699416527413
  implements MigrationInterface
{
  name = 'CreateTableProjectPurchaseOrder1699416527413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_purchase_order" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "purchase_order_id" integer NOT NULL, "vendor_type" character varying NOT NULL, "material_type" character varying, "relation_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_8b004d12b6c2ab1f56adacba35b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_purchase_order"`);
  }
}
