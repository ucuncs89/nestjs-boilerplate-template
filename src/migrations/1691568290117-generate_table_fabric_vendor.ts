import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableFabricVendor1691568290117
  implements MigrationInterface
{
  name = 'GenerateTableFabricVendor1691568290117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fabric_vendor" ("id" SERIAL NOT NULL, "fabric_id" integer NOT NULL, "vendor_id" integer NOT NULL, "content" character varying, "weight" character varying, "width" character varying, "minimum_order_quantity" character varying, "stock_availability" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c9d610bc4ddb8ac20ed343856c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fabric_vendor_color" ("id" SERIAL NOT NULL, "fabric_vendor_id" integer NOT NULL, "color_name" character varying NOT NULL, "color_code" character varying(50) NOT NULL, "vendor_id" integer, CONSTRAINT "PK_80ebc1ad253e0bac699dc0480a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fabric_vendor_document" ("id" SERIAL NOT NULL, "fabric_vendor_id" integer NOT NULL, "base_url" text NOT NULL, "file_url" text NOT NULL, "vendor_id" integer, CONSTRAINT "PK_3a9effce338a41cd30f3d267550" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor_color" ADD CONSTRAINT "FK_66a2271bc18598366d30d3c6a1f" FOREIGN KEY ("vendor_id") REFERENCES "fabric_vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor_document" ADD CONSTRAINT "FK_58cfd7dcaf0298175410c70c8d6" FOREIGN KEY ("vendor_id") REFERENCES "fabric_vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor_document" DROP CONSTRAINT "FK_58cfd7dcaf0298175410c70c8d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor_color" DROP CONSTRAINT "FK_66a2271bc18598366d30d3c6a1f"`,
    );

    await queryRunner.query(`DROP TABLE "fabric_vendor_document"`);
    await queryRunner.query(`DROP TABLE "fabric_vendor_color"`);
    await queryRunner.query(`DROP TABLE "fabric_vendor"`);
  }
}
