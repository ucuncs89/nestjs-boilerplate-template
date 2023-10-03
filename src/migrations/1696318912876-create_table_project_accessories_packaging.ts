import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectAccessoriesPackaging1696318912876
  implements MigrationInterface
{
  name = 'CreateTableProjectAccessoriesPackaging1696318912876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_accessories_packaging" ("id" SERIAL NOT NULL, "project_material_id" integer NOT NULL, "accessories_packaging_id" integer NOT NULL, "name" character varying NOT NULL, "category" character varying, "consumption" double precision, "consumption_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ae837698237c2739469c35dc626" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_accessories_packaging"`);
  }
}
