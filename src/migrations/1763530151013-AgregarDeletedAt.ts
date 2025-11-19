import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarDeletedAt1763530151013 implements MigrationInterface {
    name = 'AgregarDeletedAt1763530151013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`paciente\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`paciente\` DROP COLUMN \`deletedAt\``);
    }

}
