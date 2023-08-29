import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableVendor1693296653830 implements MigrationInterface {
  name = 'AlterTableVendor1693296653830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendors" ADD "city_id" integer`);
    await queryRunner.query(`ALTER TABLE "vendors" ADD "province_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD CONSTRAINT "FK_49d39838458103a96419adb3d1b" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD CONSTRAINT "FK_3b0ed6cdbfc8f5c80e9298b4d1d" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP CONSTRAINT "FK_3b0ed6cdbfc8f5c80e9298b4d1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP CONSTRAINT "FK_49d39838458103a96419adb3d1b"`,
    );

    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "province_id"`);
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "city_id"`);
  }
}
