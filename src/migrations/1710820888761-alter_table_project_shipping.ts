import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShipping1710820888761
  implements MigrationInterface
{
  name = 'AlterTableProjectShipping1710820888761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "total_shipping_cost" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ALTER COLUMN "shipping_cost" TYPE double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `AALTER TABLE "project_shipping" ALTER COLUMN "shipping_cost" TYPE int`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "total_shipping_cost"`,
    );
  }
}
