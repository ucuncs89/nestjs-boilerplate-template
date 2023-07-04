import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFiles1688454641379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'original_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'mimetype',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'base_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'file_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'path',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'size',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'actual_size',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'hash',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('files');
  }
}
