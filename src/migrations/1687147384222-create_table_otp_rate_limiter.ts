import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableOtpRateLimiter1687147384222
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'otp_rate_limiter',
        columns: [
          {
            name: 'user_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
            length: '50',
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('otp_rate_limiter');
  }
}
