import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFkVendorFabric1691569943922
  implements MigrationInterface
{
  name = 'AlterTableFkVendorFabric1691569943922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor" ADD CONSTRAINT "FK_bd7fc0703d65a7ac5046e8ac37c" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor" DROP CONSTRAINT "FK_bd7fc0703d65a7ac5046e8ac37c"`,
    );
  }
}
