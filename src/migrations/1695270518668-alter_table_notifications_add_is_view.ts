import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableNotificationsAddIsView1695270518668
  implements MigrationInterface
{
  name = 'AlterTableNotificationsAddIsView1695270518668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "is_view" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "is_view"`,
    );
  }
}
