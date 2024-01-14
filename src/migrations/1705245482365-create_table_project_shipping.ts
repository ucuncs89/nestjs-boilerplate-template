import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectShipping1705245482365
  implements MigrationInterface
{
  name = 'CreateTableProjectShipping1705245482365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_shipping" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "shipping_name" character varying NOT NULL, "shipping_vendor_name" character varying NOT NULL, "shipping_date" date NOT NULL, "shipping_cost" integer, "section_type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ca957864b9edd3b3162d19afe38" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_shipping"`);
  }
}
