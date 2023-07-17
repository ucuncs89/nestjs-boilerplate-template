import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateVendorType1689516514593 implements MigrationInterface {
  name = 'GenerateVendorType1689516514593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vendor_type" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_156dcdf867911a5089ba8b9e4cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_type" ADD CONSTRAINT "FK_22211f834537e3025591117bd23" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor_type" DROP CONSTRAINT "FK_22211f834537e3025591117bd23"`,
    );
    await queryRunner.query(`DROP TABLE "vendor_type"`);
  }
}
