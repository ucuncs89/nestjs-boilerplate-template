import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShipping1710225190561
  implements MigrationInterface
{
  name = 'AlterTableProjectShipping1710225190561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "send_to" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "relation_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "relation_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "relation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "relation_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "send_to"`,
    );
  }
}
