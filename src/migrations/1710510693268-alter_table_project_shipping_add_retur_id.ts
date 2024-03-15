import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShippingAddReturId1710510693268
  implements MigrationInterface
{
  name = 'AlterTableProjectShippingAddReturId1710510693268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "retur_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "retur_id"`,
    );
  }
}
