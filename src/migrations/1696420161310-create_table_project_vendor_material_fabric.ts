import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorMaterialFabric1696420161310
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorMaterialFabric1696420161310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_fabric" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "project_variant_id" integer NOT NULL, "project_fabric_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_b0102f3a90dfbcf774df6afc38f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_vendor_material_fabric_detail" ("id" SERIAL NOT NULL, "project_vendor_material_fabric_id" integer NOT NULL, "vendor_id" integer NOT NULL, "quantity" integer, "quantity_unit" character varying, "price" double precision, "total_price" double precision, "price_unit" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_5a89994c7b977812c989d9e660e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "project_vendor_material_fabric_detail"`,
    );
    await queryRunner.query(`DROP TABLE "project_vendor_material_fabric"`);
  }
}
