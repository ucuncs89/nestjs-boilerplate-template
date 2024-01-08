import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSizeDropNumberOfItem1704728617862
  implements MigrationInterface
{
  name = 'AlterTableProjectSizeDropNumberOfItem1704728617862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" DROP COLUMN "number_of_item"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" ADD "number_of_item" integer`,
    );
  }
}
