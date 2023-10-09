import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectSetSampling1696787915812
  implements MigrationInterface
{
  name = 'CreateTableProjectSetSampling1696787915812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_set_sampling" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "sampling_date" TIMESTAMP WITH TIME ZONE NOT NULL, "sampling_price" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c44a91bf26c963cb1359ab21693" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_set_sampling"`);
  }
}
