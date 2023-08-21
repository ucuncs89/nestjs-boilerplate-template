import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableAccessoriesSewing1692599382704
  implements MigrationInterface
{
  name = 'GenerateTableAccessoriesSewing1692599382704';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accessories_sewing" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying NOT NULL, "category" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f1a75b47c477b1ad8a7ead7d69e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "accessories_sewing"`);
  }
}
