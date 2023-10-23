import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectMaterialAddFinishedGoodsPercentageOfLoss1698029837286
  implements MigrationInterface
{
  name =
    'AlterTableProjectMaterialAddFinishedGoodsPercentageOfLoss1698029837286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material" ADD "finished_goods_percentage_of_loss" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material" DROP COLUMN "finished_goods_percentage_of_loss"`,
    );
  }
}
