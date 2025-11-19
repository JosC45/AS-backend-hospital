import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualFixDeletedAt1763532171883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`paciente\` 
            ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`paciente\` 
            DROP COLUMN \`deletedAt\`
        `);
    }

}