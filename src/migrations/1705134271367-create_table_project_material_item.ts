import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectMaterialItem1705134271367
  implements MigrationInterface
{
  name = 'CreateTableProjectMaterialItem1705134271367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_material_item" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "relation_id" integer NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "category" character varying, "used_for" character varying, "cut_shape" character varying, "allowance" double precision, "consumption" double precision, "consumption_unit" character varying, "width" double precision, "width_unit" character varying, "long" double precision, "long_unit" character varying, "weight" double precision, "weight_unit" character varying, "length" double precision, "length_unit" character varying, "diameter" double precision, "diameter_unit" character varying, "section_type" character varying NOT NULL, "avg_price" double precision, "total_price" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_472930e6c8dd14f10a4efe55738" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_material_item"`);
  }
}
