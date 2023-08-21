import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableAccessoriesPackaging1692597925362
  implements MigrationInterface
{
  name = 'GenerateTableAccessoriesPackaging1692597925362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accessories_packaging" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying NOT NULL, "category" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f13994eb19f3aad9bfe52c4b353" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "accessories_packaging"`);
  }
}
