import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateCustomers1688616509027 implements MigrationInterface {
  name = 'GenerateCustomers1688616509027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_documents" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "type" character varying NOT NULL, "base_url" text, "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ccc82daa515b50e68a76f343417" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "company_name" character varying NOT NULL, "company_phone_number" character varying, "company_address" text, "taxable" character varying, "pic_full_name" character varying, "pic_id_number" character varying, "pic_phone_number" character varying, "pic_email" character varying, "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "customer_documents"`);
  }
}
