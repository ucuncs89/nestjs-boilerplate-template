import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceAddGrandTotalAndProjectId1701888036787
  implements MigrationInterface
{
  name = 'AlterTableInvoiceAddGrandTotalAndProjectId1701888036787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "project_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "grand_total" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "grand_total"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "project_id"`);
  }
}
