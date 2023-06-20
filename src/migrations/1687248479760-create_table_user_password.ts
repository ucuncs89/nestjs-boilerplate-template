import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUserPassword1687248479760
  implements MigrationInterface
{
  name = 'CreateTableUserPassword1687248479760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_password" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_2d2fbddb3cc97260cdf59651754" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_password"`);
  }
}
