import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectAccessoriesSewing1696318780397
  implements MigrationInterface
{
  name = 'CreateTableProjectAccessoriesSewing1696318780397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_accessories_sewing" ("id" SERIAL NOT NULL, "project_material_id" integer NOT NULL, "accessories_sewing_id" integer NOT NULL, "name" character varying NOT NULL, "category" character varying, "consumption" double precision, "consumption_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_3279913683acaf11cc09d24e153" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_accessories_sewing"`);
  }
}
