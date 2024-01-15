import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddHoldCancelDescription1705291650718
  implements MigrationInterface
{
  name = 'AlterTableProjectAddHoldCancelDescription1705291650718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "cancel_description" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "hold_description" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "hold_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "cancel_description"`,
    );
  }
}
