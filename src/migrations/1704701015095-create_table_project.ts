import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProject1704701015095 implements MigrationInterface {
  name = 'CreateTableProject1704701015095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "sequential_number" character varying, "style_name" character varying NOT NULL, "customer_id" integer NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "order_type" character varying NOT NULL, "description" text, "department_id" integer, "category_id" integer, "sub_category_id" integer, "company" character varying, "user_id" integer, "target_price_for_customer" double precision, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "is_sent_deadline" boolean DEFAULT false, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_size" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "size_ratio" character varying NOT NULL, "number_of_item" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c8666e0c31f4ce9d96093cc235d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_history" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ebb2afe7b38faa45844bfa91211" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_variant_size" ("id" SERIAL NOT NULL, "project_variant_id" integer NOT NULL, "size_ratio" character varying NOT NULL, "number_of_item" integer, "size_unit" character varying(50), CONSTRAINT "PK_78c876c1c10c4244981006038d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_variant_fabric_color" ("id" SERIAL NOT NULL, "project_variant_id" integer NOT NULL, "color_id" integer, "color_name" character varying, "project_fabric_id" integer NOT NULL, CONSTRAINT "PK_451097a9a8b96a125df0140a531" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_variant" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "name" character varying NOT NULL, "total_item" integer, "item_unit" character varying(50), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_eb9373a5e7a2d04bb8a1597f1b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_document" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "type" character varying NOT NULL, "base_url" text, "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_e4aab0d22ce621e3dff35e57fa7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_document"`);
    await queryRunner.query(`DROP TABLE "project_variant"`);
    await queryRunner.query(`DROP TABLE "project_variant_fabric_color"`);
    await queryRunner.query(`DROP TABLE "project_variant_size"`);
    await queryRunner.query(`DROP TABLE "project_history"`);
    await queryRunner.query(`DROP TABLE "project_size"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
