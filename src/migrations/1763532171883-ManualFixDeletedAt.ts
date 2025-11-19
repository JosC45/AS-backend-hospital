import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualFixDeletedAt1763532075620 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Agregar a PACIENTE
        try {
            await queryRunner.query(`ALTER TABLE \`paciente\` ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL`);
            console.log("✅ Columna deletedAt agregada a 'paciente'");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME' || e.errno === 1060) {
                console.log("⚠️ Columna deletedAt ya existía en 'paciente'. Saltando.");
            } else { throw e; }
        }

        // 2. Agregar a HOSPITALIZACION (Esta es la que te daba el error recién)
        try {
            await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL`);
            console.log("✅ Columna deletedAt agregada a 'hospitalizacion'");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME' || e.errno === 1060) {
                console.log("⚠️ Columna deletedAt ya existía en 'hospitalizacion'. Saltando.");
            } else { throw e; }
        }

        // 3. Agregar a ORDEN (Probablemente también la necesites según los logs)
        try {
            await queryRunner.query(`ALTER TABLE \`orden\` ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL`);
            console.log("✅ Columna deletedAt agregada a 'orden'");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME' || e.errno === 1060) {
                console.log("⚠️ Columna deletedAt ya existía en 'orden'. Saltando.");
            } else { throw e; }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios si fuera necesario
        try { await queryRunner.query(`ALTER TABLE \`orden\` DROP COLUMN \`deletedAt\``); } catch (e) { }
        try { await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP COLUMN \`deletedAt\``); } catch (e) { }
        try { await queryRunner.query(`ALTER TABLE \`paciente\` DROP COLUMN \`deletedAt\``); } catch (e) { }
    }
}