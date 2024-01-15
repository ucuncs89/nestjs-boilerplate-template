import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTableAllProject1704699322791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS project_vendor_production_detail`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS project_vendor_production`);

    await queryRunner.query(
      `DROP TABLE IF EXISTS project_vendor_material_finished_good_detail`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS project_vendor_material_finished_good`,
    );

    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_fabric_detail',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_fabric',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_detail',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_accessories_sewing_detail',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_accessories_sewing',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_accessories_packaging_detail',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_vendor_material_accessories_packaging',
    );
    await queryRunner.query('DROP TABLE IF EXISTS project_vendor_material');
    await queryRunner.query('DROP TABLE IF EXISTS project_variant_size');
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_variant_fabric_color',
    );
    await queryRunner.query('DROP TABLE IF EXISTS project_variant');
    await queryRunner.query('DROP TABLE IF EXISTS project_size');
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_shipping_packing_detail',
    );
    await queryRunner.query('DROP TABLE IF EXISTS project_shipping_packing');
    await queryRunner.query('DROP TABLE IF EXISTS project_shipping');
    await queryRunner.query('DROP TABLE IF EXISTS project_set_sampling');
    await queryRunner.query('DROP TABLE IF EXISTS project_sampling_status');
    await queryRunner.query('DROP TABLE IF EXISTS project_sampling_revisi');
    await queryRunner.query('DROP TABLE IF EXISTS project_remarks');
    await queryRunner.query('DROP TABLE IF EXISTS project_purchase_order');
    await queryRunner.query('DROP TABLE IF EXISTS project_price_additional');
    await queryRunner.query('DROP TABLE IF EXISTS project_price');
    await queryRunner.query('DROP TABLE IF EXISTS project_material_item');
    await queryRunner.query('DROP TABLE IF EXISTS project_material');
    await queryRunner.query('DROP TABLE IF EXISTS project_invoice');
    await queryRunner.query('DROP TABLE IF EXISTS project_history');
    await queryRunner.query('DROP TABLE IF EXISTS project_fabric');
    await queryRunner.query('DROP TABLE IF EXISTS project_document');
    await queryRunner.query('DROP TABLE IF EXISTS project_detail');
    await queryRunner.query('DROP TABLE IF EXISTS project_accessories_sewing');
    await queryRunner.query(
      'DROP TABLE IF EXISTS project_accessories_packaging',
    );
    await queryRunner.query('DROP TABLE IF EXISTS project');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
