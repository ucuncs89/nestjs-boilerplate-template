import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableProject1693816293975 implements MigrationInterface {
  name = 'GenerateTableProject1693816293975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "style_name" character varying NOT NULL, "customer_id" integer NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "order_type" character varying NOT NULL, "description" text, "department_id" integer, "category_id" integer, "sub_category_id" integer, "company" character varying, "user_id" integer, "target_price_for_customer" double precision, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_document" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "type" character varying NOT NULL, "base_url" text, "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_e4aab0d22ce621e3dff35e57fa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_size" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "size_ration" character varying NOT NULL, "number_of_item" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c8666e0c31f4ce9d96093cc235d" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_document" ADD CONSTRAINT "FK_1f28dd14d683a26b6f1ad62584e" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_size" ADD CONSTRAINT "FK_12d93925c6a6a563cc2cfdefce7" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" DROP CONSTRAINT "FK_12d93925c6a6a563cc2cfdefce7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_document" DROP CONSTRAINT "FK_1f28dd14d683a26b6f1ad62584e"`,
    );
    await queryRunner.query(`DROP TABLE "project_size"`);
    await queryRunner.query(`DROP TABLE "project_document"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
