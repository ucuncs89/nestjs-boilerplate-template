import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectShippingPackingList1709281380081
  implements MigrationInterface
{
  name = 'CreateTableProjectShippingPackingList1709281380081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_shipping_packing" ("id" SERIAL NOT NULL, "project_shipping_id" integer NOT NULL, "variant_name" character varying NOT NULL, "variant_id" integer NOT NULL, "total_item" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c02dcdabf548a21553a680155d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_shipping_packing_detail" ("id" SERIAL NOT NULL, "project_shipping_packing_id" integer NOT NULL, "size_ratio" character varying NOT NULL, "number_of_item" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_3dd17aee20ea090b229a72ff46c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_shipping_packing_detail"`);
    await queryRunner.query(`DROP TABLE "project_shipping_packing"`);
  }
}
