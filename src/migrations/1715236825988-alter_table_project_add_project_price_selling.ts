import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddProjectPriceSelling1715236825988
  implements MigrationInterface
{
  name = 'AlterTableProjectAddProjectPriceSelling1715236825988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "project_price_selling" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "project_price_selling"`,
    );
  }
}
