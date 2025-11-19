import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualFixDeletedAt1763532171883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // Intentamos agregar la columna
            await queryRunner.query(`
                ALTER TABLE \`paciente\` 
                ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL
            `);
        } catch (error: any) {
            // Si el error es el código 1060 (Duplicate column name), lo ignoramos y seguimos.
            // Esto significa que la base de datos ya está correcta.
            if (error.errno === 1060 || error.code === 'ER_DUP_FIELDNAME') {
                console.log("⚠️ La columna 'deletedAt' ya existía. Marcando migración como completada.");
                return; // Salimos exitosamente
            }
            // Si es cualquier otro error, lanzamos la excepción para que falle el deploy
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`paciente\` 
            DROP COLUMN \`deletedAt\`
        `);
    }

}