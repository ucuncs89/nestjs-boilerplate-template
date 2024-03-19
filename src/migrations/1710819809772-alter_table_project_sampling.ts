import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSampling1710819809772
  implements MigrationInterface
{
  name = 'AlterTableProjectSampling1710819809772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" ADD "total_cost" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" DROP COLUMN "total_cost"`,
    );
  }
}
