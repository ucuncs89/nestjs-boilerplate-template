import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSizeAddTotalItem1705472442383
  implements MigrationInterface
{
  name = 'AlterTableProjectSizeAddTotalItem1705472442383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" ADD "total_item" integer DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" DROP COLUMN "total_item"`,
    );
  }
}
