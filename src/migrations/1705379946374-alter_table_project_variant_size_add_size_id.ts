import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVariantSizeAddSizeId1705379946374
  implements MigrationInterface
{
  name = 'AlterTableProjectVariantSizeAddSizeId1705379946374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_variant_size" ADD "size_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_variant_size" DROP COLUMN "size_id"`,
    );
  }
}
