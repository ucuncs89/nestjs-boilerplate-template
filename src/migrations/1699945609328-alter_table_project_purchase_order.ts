import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectPurchaseOrder1699945609328
  implements MigrationInterface
{
  name = 'AlterTableProjectPurchaseOrder1699945609328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_purchase_order" ADD "vendor_id" integer`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_purchase_order" ALTER COLUMN "relation_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_purchase_order" ALTER COLUMN "relation_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_purchase_order" DROP COLUMN "vendor_id"`,
    );
  }
}
