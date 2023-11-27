import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMasterCost1701066909202 implements MigrationInterface {
  name = 'CreateTableMasterCost1701066909202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cost" ("id" SERIAL NOT NULL, "code" character varying, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_9457483cde444b1dd32aacb24bb" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cost"`);
  }
}
