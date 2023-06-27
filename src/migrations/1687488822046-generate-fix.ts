import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateFix1687488822046 implements MigrationInterface {
  name = 'GenerateFix1687488822046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
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
      `ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ADD "updated_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ADD "deleted_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" ADD "type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(`ALTER TABLE "user_otp" DROP COLUMN "otp"`);
    await queryRunner.query(
      `ALTER TABLE "user_otp" ADD "otp" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_detail" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_password" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_47a354e630607052e998d36267" ON "roles_permission" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6146087c365cb4328a2d651ff9" ON "roles_permission" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6146087c365cb4328a2d651ff9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_47a354e630607052e998d36267"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2023-06-07 07:49:12.784914+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_password" ALTER COLUMN "created_at" SET DEFAULT '2023-06-20 08:09:18.604649+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_detail" ALTER COLUMN "created_at" SET DEFAULT '2023-06-19 03:56:21.53781+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_otp" DROP COLUMN "otp"`);
    await queryRunner.query(
      `ALTER TABLE "user_otp" ADD "otp" character varying(8) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" ADD "type" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ALTER COLUMN "created_at" SET DEFAULT '2023-06-07 07:49:12.784914+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT '2023-06-07 07:49:12.784914+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT '2023-06-22 07:01:28.809336+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT '2023-06-19 03:56:21.53781+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2023-06-07 07:49:12.784914+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2023-06-22 07:01:28.809336+00'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
