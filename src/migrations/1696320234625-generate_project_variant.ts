import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateProjectVariant1696320234625 implements MigrationInterface {
  name = 'GenerateProjectVariant1696320234625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_variant_size" ("id" SERIAL NOT NULL, "project_variant_id" integer NOT NULL, "size_ratio" character varying NOT NULL, "number_of_item" integer, "size_unit" character varying(50), CONSTRAINT "PK_78c876c1c10c4244981006038d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_variant" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "name" character varying NOT NULL, "total_item" integer, "item_unit" character varying(50), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_eb9373a5e7a2d04bb8a1597f1b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_variant_fabric_color" ("id" SERIAL NOT NULL, "project_variant_id" integer NOT NULL, "color_id" integer, "color_name" character varying, "project_fabric_id" integer NOT NULL, CONSTRAINT "PK_451097a9a8b96a125df0140a531" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_variant_size" ADD CONSTRAINT "FK_2fdd6759fc925efb8f53201357e" FOREIGN KEY ("project_variant_id") REFERENCES "project_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_variant_fabric_color" ADD CONSTRAINT "FK_9d16465e643cfb386e4641eb051" FOREIGN KEY ("project_variant_id") REFERENCES "project_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_variant_fabric_color" DROP CONSTRAINT "FK_9d16465e643cfb386e4641eb051"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_variant_size" DROP CONSTRAINT "FK_2fdd6759fc925efb8f53201357e"`,
    );

    await queryRunner.query(`DROP TABLE "project_variant_fabric_color"`);
    await queryRunner.query(`DROP TABLE "project_variant"`);
    await queryRunner.query(`DROP TABLE "project_variant_size"`);
  }
}
