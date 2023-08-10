import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFabricVendor1691574711606 implements MigrationInterface {
  name = 'AlterTableFabricVendor1691574711606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor" ADD "code" character varying(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "fabric_vendor" DROP COLUMN "code"`);
  }
}
