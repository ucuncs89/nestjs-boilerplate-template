import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generate1716264256597 implements MigrationInterface {
  name = 'Generate1716264256597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "parent_id" integer, "title" character varying(50), "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_detail" ("user_id" integer NOT NULL, "login_at" TIMESTAMP WITH TIME ZONE, "logout_at" TIMESTAMP WITH TIME ZONE, "expired_token" TIMESTAMP WITH TIME ZONE, "password_rate_limiter" integer, "suspend_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_aebc3bfe11ea329ed91cd8c5759" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" text NOT NULL, "full_name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "need_verification" boolean NOT NULL DEFAULT true, "path_picture" text, "base_path" text, "is_forgot_password" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "title" character varying(50), "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "original_name" text, "mimetype" text, "base_url" text, "file_name" text, "path" text, "size" integer, "actual_size" integer, "hash" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp_rate_limiter" ("user_id" integer NOT NULL, "count" integer, "type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fbd27e1e757babfb0ca64887a3d" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("user_id" integer NOT NULL, "otp" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_7c4b83e0619128a0b57da32228c" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "created_by" integer, CONSTRAINT "PK_a675e3a82a6810f3eccaa9253a9" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_password" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_2d2fbddb3cc97260cdf59651754" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_token" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6146087c365cb4328a2d651ff9" ON "roles_permission" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_47a354e630607052e998d36267" ON "roles_permission" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_47a354e630607052e998d36267"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6146087c365cb4328a2d651ff9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(`DROP TABLE "user_token"`);
    await queryRunner.query(`DROP TABLE "user_password"`);
    await queryRunner.query(`DROP TABLE "roles_permission"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
    await queryRunner.query(`DROP TABLE "otp_rate_limiter"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_detail"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
