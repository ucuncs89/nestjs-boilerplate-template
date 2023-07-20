import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableVendors1689514379899 implements MigrationInterface {
  name = 'GenerateTableVendors1689514379899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vendors" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "company_name" character varying NOT NULL, "company_phone_number" character varying, "company_address" text, "taxable" character varying, "pic_full_name" character varying, "pic_id_number" character varying, "pic_phone_number" character varying, "pic_email" character varying, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "last_order" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_documents" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "type" character varying NOT NULL, "base_url" text, "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_b6aa864f4d6f4a283445266a4dc" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "vendor_documents" ADD CONSTRAINT "FK_218ad2aece37d1c3bf7cfe6c72f" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor_documents" DROP CONSTRAINT "FK_218ad2aece37d1c3bf7cfe6c72f"`,
    );

    await queryRunner.query(`DROP TABLE "vendor_documents"`);

    await queryRunner.query(`DROP TABLE "vendors"`);
  }
}
