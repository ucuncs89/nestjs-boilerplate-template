import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectHoldCancelDescription1716111145210
  implements MigrationInterface
{
  name = 'AlterTableProjectHoldCancelDescription1716111145210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "cancel_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "cancel_description" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "hold_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "hold_description" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "hold_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "hold_description" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "cancel_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "cancel_description" character varying(50)`,
    );
  }
}
