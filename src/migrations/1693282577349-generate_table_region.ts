import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableRegion1693282577349 implements MigrationInterface {
  name = 'GenerateTableRegion1693282577349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "province" ("id" SERIAL NOT NULL, "code" character varying, "name" character varying, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" SERIAL NOT NULL, "province_id" integer NOT NULL, "code" character varying, "name" character varying, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "district" ("id" SERIAL NOT NULL, "city_id" integer NOT NULL, "code" character varying, "name" character varying, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "village" ("id" SERIAL NOT NULL, "district_id" integer NOT NULL, "code" character varying, "name" character varying, CONSTRAINT "PK_3ada8696ae059b2fcf82d5ab579" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_efa45f1f32db90d7c6554a353ed" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "district" ADD CONSTRAINT "FK_0364a9a27eee3d5294627fdd659" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "village" ADD CONSTRAINT "FK_e5567b9d072a21fccf1b66defc5" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "village" DROP CONSTRAINT "FK_e5567b9d072a21fccf1b66defc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "district" DROP CONSTRAINT "FK_0364a9a27eee3d5294627fdd659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_efa45f1f32db90d7c6554a353ed"`,
    );

    await queryRunner.query(`DROP TABLE "village"`);
    await queryRunner.query(`DROP TABLE "district"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "province"`);
  }
}
