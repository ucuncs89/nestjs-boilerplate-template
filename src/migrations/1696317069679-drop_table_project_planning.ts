import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTableProjectPlanning1696317069679
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "project_planning" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_fabric" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_accessories_sewing" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_accessories_packaging" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_variant_fabric_color" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_variant" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "project_planning_variant_size" CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
