import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectDetailAddIsSamplingAndIsConfirm1696904063767
  implements MigrationInterface
{
  name = 'AlterTableProjectDetailAddIsSamplingAndIsConfirm1696904063767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "is_sampling" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" ADD "is_confirm" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "is_confirm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail" DROP COLUMN "is_sampling"`,
    );
  }
}
