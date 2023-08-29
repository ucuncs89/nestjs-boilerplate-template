import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCustomer1693295865657 implements MigrationInterface {
  name = 'AlterTableCustomer1693295865657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" ADD "city_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "province_id" integer`,
    );

    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_ddf27769e29b0c4a0354bb5aaa7" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_41c12896f1dca3dbab30b32119f" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_41c12896f1dca3dbab30b32119f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_ddf27769e29b0c4a0354bb5aaa7"`,
    );

    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "province_id"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "city_id"`);
  }
}
