import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTablePlanningVariant1695960541324
  implements MigrationInterface
{
  name = 'GenerateTablePlanningVariant1695960541324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_planning_variant_size" ("id" SERIAL NOT NULL, "project_planning_variant_id" integer NOT NULL, "size_ratio" character varying NOT NULL, "number_of_item" integer, "size_unit" character varying(50), CONSTRAINT "PK_d22ebe7ef371c0922227c858dfd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_planning_variant" ("id" SERIAL NOT NULL, "project_planning_id" integer NOT NULL, "name" character varying NOT NULL, "total_item" integer, "item_unit" character varying(50), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_1a5a983a695d220e9ec594db7b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_planning_variant_fabric_color" ("id" SERIAL NOT NULL, "project_planning_variant_id" integer NOT NULL, "color_id" integer, "color_name" character varying, "project_planning_fabric_id" integer NOT NULL, CONSTRAINT "PK_1e925aaa264dccd5f63d8f07b6b" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_planning_variant_size" ADD CONSTRAINT "FK_8ade0f224ff1820debaee670537" FOREIGN KEY ("project_planning_variant_id") REFERENCES "project_planning_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_variant_fabric_color" ADD CONSTRAINT "FK_b2e946fdb3e4f367c9a653c3a9e" FOREIGN KEY ("project_planning_variant_id") REFERENCES "project_planning_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_variant_fabric_color" DROP CONSTRAINT "FK_b2e946fdb3e4f367c9a653c3a9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_variant_size" DROP CONSTRAINT "FK_8ade0f224ff1820debaee670537"`,
    );

    await queryRunner.query(
      `DROP TABLE "project_planning_variant_fabric_color"`,
    );
    await queryRunner.query(`DROP TABLE "project_planning_variant"`);
    await queryRunner.query(`DROP TABLE "project_planning_variant_size"`);
  }
}
