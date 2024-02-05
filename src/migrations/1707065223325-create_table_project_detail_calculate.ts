import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectDetailCalculate1707065223325
  implements MigrationInterface
{
  name = 'CreateTableProjectDetailCalculate1707065223325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_detail_calculate" ("project_id" integer NOT NULL, "type" character varying NOT NULL, "total_price" double precision DEFAULT '0', "avg_price" double precision DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_d31b4908ad5f487febdf2687d5a" PRIMARY KEY ("project_id", "type"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_detail_calculate"`);
  }
}
