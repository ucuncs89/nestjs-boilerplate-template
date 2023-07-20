import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1689841159622 implements MigrationInterface {
    name = 'Migrations1689841159622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47a354e630607052e998d36267"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6146087c365cb4328a2d651ff9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_type" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_156dcdf867911a5089ba8b9e4cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendors" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "company_name" character varying NOT NULL, "company_phone_number" character varying, "company_address" text, "taxable" character varying, "pic_full_name" character varying, "pic_id_number" character varying, "pic_phone_number" character varying, "pic_email" character varying, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "last_order" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_documents" ("id" SERIAL NOT NULL, "vendor_id" integer NOT NULL, "type" character varying NOT NULL, "base_url" text, "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_b6aa864f4d6f4a283445266a4dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "device_id"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD "source_id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD "device" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "mail_templates" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "user_detail" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "test" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "otp_rate_limiter" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "user_otp" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "user_password" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "user_token" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`CREATE INDEX "IDX_6146087c365cb4328a2d651ff9" ON "roles_permission" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_47a354e630607052e998d36267" ON "roles_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "customer_documents" ADD CONSTRAINT "FK_5301fb44d91d7a9102f12fba583" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_type" ADD CONSTRAINT "FK_22211f834537e3025591117bd23" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_documents" ADD CONSTRAINT "FK_218ad2aece37d1c3bf7cfe6c72f" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_47a354e630607052e998d362679"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP CONSTRAINT "FK_6146087c365cb4328a2d651ff91"`);
        await queryRunner.query(`ALTER TABLE "vendor_documents" DROP CONSTRAINT "FK_218ad2aece37d1c3bf7cfe6c72f"`);
        await queryRunner.query(`ALTER TABLE "vendor_type" DROP CONSTRAINT "FK_22211f834537e3025591117bd23"`);
        await queryRunner.query(`ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_5301fb44d91d7a9102f12fba583"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47a354e630607052e998d36267"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6146087c365cb4328a2d651ff9"`);
        await queryRunner.query(`ALTER TABLE "user_token" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_password" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "user_otp" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "otp_rate_limiter" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "test" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "user_detail" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "mail_templates" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ALTER COLUMN "created_at" SET DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "device"`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "source_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "roles_permission" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2023-07-11 10:43:40.795601+00'`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD "device_id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD "source" character varying`);
        await queryRunner.query(`DROP TABLE "vendor_documents"`);
        await queryRunner.query(`DROP TABLE "vendors"`);
        await queryRunner.query(`DROP TABLE "vendor_type"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6146087c365cb4328a2d651ff9" ON "roles_permission" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_47a354e630607052e998d36267" ON "roles_permission" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_6146087c365cb4328a2d651ff91" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission" ADD CONSTRAINT "FK_47a354e630607052e998d362679" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
