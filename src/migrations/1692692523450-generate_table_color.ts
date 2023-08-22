import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableColor1692692523450 implements MigrationInterface {
  name = 'GenerateTableColor1692692523450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "color" ("id" SERIAL NOT NULL, "code" character varying(50), "name" character varying NOT NULL, "color_code" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_d15e531d60a550fbf23e1832343" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "color"`);
  }
}
