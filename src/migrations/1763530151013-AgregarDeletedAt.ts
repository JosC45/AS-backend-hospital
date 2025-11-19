import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarDeletedAt1763530151013 implements MigrationInterface {
    name = 'AgregarDeletedAt1763530151013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_consulta_cita\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_hospitalizacion_paciente\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD \`estado\` enum ('finalizado', 'hospitalizacion_ordenada') NOT NULL DEFAULT 'finalizado'`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD UNIQUE INDEX \`IDX_c41caae7516a15444bd366671c\` (\`id_cita\`)`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde', 'azul') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orden\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD UNIQUE INDEX \`IDX_c41caae7516a15444bd366671c\` (\`id_cita\`)`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde', 'azul') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orden\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c41caae7516a15444bd366671c\` ON \`consulta\` (\`id_cita\`)`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_c41caae7516a15444bd366671c8\` FOREIGN KEY (\`id_cita\`) REFERENCES \`cita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_8cc9a856de312d0785ab1509e37\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_8cc9a856de312d0785ab1509e37\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_c41caae7516a15444bd366671c8\``);
        await queryRunner.query(`DROP INDEX \`REL_c41caae7516a15444bd366671c\` ON \`consulta\``);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NULL`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`orden\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP INDEX \`IDX_c41caae7516a15444bd366671c\``);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`cita\` CHANGE \`especialidad\` \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NULL`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`orden\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`triage\` CHANGE \`prioridad\` \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP INDEX \`IDX_c41caae7516a15444bd366671c\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD \`estado\` varchar(255) NOT NULL DEFAULT 'proceso'`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_hospitalizacion_paciente\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_consulta_cita\` FOREIGN KEY (\`id_cita\`) REFERENCES \`cita\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
