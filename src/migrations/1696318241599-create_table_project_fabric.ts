import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectFabric1696318241599
  implements MigrationInterface
{
  name = 'CreateTableProjectFabric1696318241599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_fabric" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "fabric_id" integer NOT NULL, "name" character varying NOT NULL, "category" character varying, "used_for" character varying, "cut_shape" character varying, "consumption" double precision, "consumption_unit" character varying, "heavy" double precision, "heavy_unit" character varying, "long" double precision, "long_unit" character varying, "wide" double precision, "wide_unit" character varying, "diameter" double precision, "diameter_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_fb3879848ea3eea20c341976271" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_fabric"`);
  }
}
