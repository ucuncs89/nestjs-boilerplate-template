import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrder1708502882982
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrder1708502882982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "project_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "project_id"`,
    );
  }
}
