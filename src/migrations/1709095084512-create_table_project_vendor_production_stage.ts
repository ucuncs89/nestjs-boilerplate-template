import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectVendorProductionStage1709095084512
  implements MigrationInterface
{
  name = 'CreateTableProjectVendorProductionStage1709095084512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_vendor_production_stage" ("id" SERIAL NOT NULL, "from_vendor_detail_id" integer NOT NULL, "from_vendor_detail_name" character varying NOT NULL, "from_vendor_activity_name" character varying, "to_vendor_detail_id" integer NOT NULL, "to_vendor_detail_name" character varying NOT NULL, "to_vendor_activity_name" character varying, "date" date NOT NULL, "description" text NOT NULL, "created_by" integer NOT NULL, "deleted_by" integer NOT NULL, "deleted_at" TIME WITH TIME ZONE NOT NULL, CONSTRAINT "PK_98793a7680f569c1c0806c45847" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_vendor_production_stage"`);
  }
}
