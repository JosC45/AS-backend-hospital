import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAivenSync1763533775160 implements MigrationInterface {
    name = 'FixAivenSync1763533775160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cita\` DROP COLUMN \`fecha_atencion\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD \`id_cita\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD UNIQUE INDEX \`IDX_c41caae7516a15444bd366671c\` (\`id_cita\`)`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD \`id_paciente\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD \`fecha_hora_inicio\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD \`fecha_hora_fin\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD \`estado\` enum ('Programada', 'Confirmada', 'Completada', 'Cancelada', 'Ausente') NOT NULL DEFAULT 'Programada'`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD \`estado\` enum ('finalizado', 'hospitalizacion_ordenada') NOT NULL DEFAULT 'finalizado'`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde', 'azul') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde', 'azul') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c41caae7516a15444bd366671c\` ON \`consulta\` (\`id_cita\`)`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_c41caae7516a15444bd366671c8\` FOREIGN KEY (\`id_cita\`) REFERENCES \`cita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_8cc9a856de312d0785ab1509e37\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_8cc9a856de312d0785ab1509e37\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_c41caae7516a15444bd366671c8\``);
        await queryRunner.query(`DROP INDEX \`REL_c41caae7516a15444bd366671c\` ON \`consulta\``);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('emergencia', 'consultorio_externo', 'hospitalizacion') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('Prioridad_I', 'Prioridad_II', 'Prioridad_III', 'Prioridad_IV') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('emergencia', 'consultorio_externo', 'hospitalizacion') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('Prioridad_I', 'Prioridad_II', 'Prioridad_III', 'Prioridad_IV') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD \`estado\` varchar(255) NOT NULL DEFAULT 'proceso'`);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP COLUMN \`fecha_hora_fin\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP COLUMN \`fecha_hora_inicio\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP COLUMN \`id_paciente\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP INDEX \`IDX_c41caae7516a15444bd366671c\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP COLUMN \`id_cita\``);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD \`fecha_atencion\` datetime NOT NULL`);
    }

}
