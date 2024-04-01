import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderAddReceiveStatus1711941313469
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderAddReceiveStatus1711941313469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "status_receive" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "status_receive_attempt_user" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "status_receive_attempt_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "status_receive"`,
    );
  }
}
