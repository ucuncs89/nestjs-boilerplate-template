import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1687410176262 implements MigrationInterface {
  name = 'Generate1687410176262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "id" SERIAL NOT NULL, "parent_id" integer, "title" character varying(50), "description" text NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "created_by" integer, CONSTRAINT "PK_a675e3a82a6810f3eccaa9253a9" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`,
    );
    await queryRunner.query(`DROP TABLE "roles_permission"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
