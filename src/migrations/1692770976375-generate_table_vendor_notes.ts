import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableVendorNotes1692770976375
  implements MigrationInterface
{
  name = 'GenerateTableVendorNotes1692770976375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vendor_notes" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "notes" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_94150154715055da05571ef74ff" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vendor_notes"`);
  }
}
