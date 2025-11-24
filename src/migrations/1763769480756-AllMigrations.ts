import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigrations1763769480756 implements MigrationInterface {
    name = 'AllMigrations1763769480756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`medicamento\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`presentacion\` varchar(255) NOT NULL, \`dosis\` varchar(255) NOT NULL, \`via_administracion\` varchar(255) NOT NULL, \`frecuencia\` varchar(255) NOT NULL, \`duracion\` varchar(255) NOT NULL, \`id_orden\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orden\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lugar_emision\` varchar(255) NOT NULL, \`diagnostico_principal\` varchar(255) NOT NULL, \`indicaciones_terapeuticas\` varchar(255) NOT NULL, \`fecha_creacion\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime(6) NULL, \`id_paciente\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paciente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`dni\` int NOT NULL, \`fecha_nacimiento\` datetime NOT NULL, \`correo\` varchar(255) NOT NULL, \`numero\` varchar(255) NOT NULL, \`domicilio\` varchar(255) NOT NULL, \`genero\` enum ('masculino', 'femenino') NOT NULL, \`seguro\` enum ('Sis', 'EsSalud', 'EPS', 'Particular') NOT NULL, \`tipo_sangre\` varchar(255) NOT NULL, \`deletedAt\` datetime(6) NULL, \`historiaId\` int NULL, UNIQUE INDEX \`REL_9e31f3fab8a3b88916c92871eb\` (\`historiaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`camas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`piso\` varchar(255) NOT NULL, \`cama\` varchar(255) NOT NULL, \`estado\` enum ('disponible', 'ocupada', 'mantenimiento') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hospitalizacion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`intervencion\` enum ('triaje', 'consulta') NOT NULL, \`id_intervencion\` int NOT NULL, \`fecha_ingreso\` datetime NOT NULL, \`estado\` enum ('hospitalizado', 'alta') NOT NULL, \`diagnostico_ingreso\` varchar(255) NOT NULL, \`area_destino\` enum ('medicina_interna', 'cirugia', 'pediatria', 'ginecologia', 'uci') NOT NULL, \`diagnostico_alta\` varchar(255) NULL, \`diagnostico_secundario\` varchar(255) NULL, \`tratamiento_realizado\` varchar(255) NULL, \`recomendaciones_hogar\` varchar(255) NULL, \`pronostico\` varchar(255) NULL, \`fecha_salida\` datetime NULL, \`deletedAt\` datetime(6) NULL, \`id_paciente\` int NULL, \`id_cama\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`personal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('secretaria', 'cajera') NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_7c9f9239a8132547837f6fdf48\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`keyword\` (\`id\` int NOT NULL AUTO_INCREMENT, \`palabra_clave\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`rol\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, \`personalId\` int NULL, \`keywordId\` int NULL, UNIQUE INDEX \`REL_d3d3c548124be293ce31c8dfc7\` (\`personalId\`), UNIQUE INDEX \`REL_bef018a6b31e863bf1c597a9a0\` (\`keywordId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medico\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('asistente', 'interno', 'especialista') NOT NULL, \`especialidad\` varchar(255) NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_aec4c649fc7271a07188203310\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cita\` (\`id\` int NOT NULL AUTO_INCREMENT, \`especialidad\` enum ('consultorio_externo', 'procedimiento', 'otro') NOT NULL, \`fecha_hora_inicio\` datetime NOT NULL, \`fecha_hora_fin\` datetime NOT NULL, \`motivo\` varchar(255) NOT NULL, \`estado\` enum ('Programada', 'Confirmada', 'Completada', 'Cancelada', 'Ausente') NOT NULL DEFAULT 'Programada', \`deletedAt\` datetime(6) NULL, \`id_paciente\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`consulta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`motivo_consulta\` varchar(255) NOT NULL, \`fecha_atencion\` datetime NOT NULL, \`tiempo_enfermedad\` varchar(255) NOT NULL DEFAULT '-', \`presion_arterial\` varchar(255) NOT NULL DEFAULT '-', \`latidos_pm\` varchar(255) NOT NULL DEFAULT '-', \`frecuencia_respiratoria\` varchar(255) NOT NULL DEFAULT '-', \`temperatura\` float NULL, \`peso\` varchar(255) NOT NULL DEFAULT '-', \`talla\` varchar(255) NOT NULL DEFAULT '-', \`observaciones\` varchar(255) NOT NULL DEFAULT '-', \`descripcion_diagnostico\` varchar(255) NOT NULL DEFAULT '-', \`codigo\` varchar(255) NOT NULL DEFAULT '-', \`tipo_diagnostico\` enum ('presuntivo', 'definitivo', 'repetitivo') NULL, \`tratamiento\` varchar(255) NOT NULL DEFAULT '-', \`fecha_creacion\` datetime NOT NULL, \`estado\` enum ('finalizado', 'hospitalizacion_ordenada') NOT NULL DEFAULT 'finalizado', \`id_medico\` int NULL, \`id_historia\` int NULL, \`id_cita\` int NULL, UNIQUE INDEX \`REL_c41caae7516a15444bd366671c\` (\`id_cita\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`historia\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha_creacion\` datetime NOT NULL, \`antecedentes_natales\` varchar(255) NULL, \`antecedentes_personales\` varchar(255) NULL, \`antecedentes_familiares\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`triage\` (\`id\` int NOT NULL AUTO_INCREMENT, \`motivo\` varchar(255) NOT NULL, \`presion_arterial\` varchar(255) NOT NULL DEFAULT '-', \`latidos_pm\` varchar(255) NOT NULL DEFAULT '-', \`frecuencia_respiratoria\` varchar(255) NOT NULL DEFAULT '-', \`temperatura\` float NULL, \`prioridad\` enum ('rojo', 'naranja', 'amarillo', 'verde', 'azul') NOT NULL, \`observaciones\` varchar(255) NOT NULL DEFAULT '-', \`estado\` varchar(255) NOT NULL DEFAULT 'proceso', \`fecha_creacion\` datetime NOT NULL, \`id_historia\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nota\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(255) NOT NULL, \`fecha_creacion\` datetime NOT NULL, \`id_hospitalizacion\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`medicamento\` ADD CONSTRAINT \`FK_f15f80da7ae3e8e2baab8e7942b\` FOREIGN KEY (\`id_orden\`) REFERENCES \`orden\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orden\` ADD CONSTRAINT \`FK_bbeadbd344c1998a3f31d7ce473\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`paciente\` ADD CONSTRAINT \`FK_9e31f3fab8a3b88916c92871eba\` FOREIGN KEY (\`historiaId\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_8cc9a856de312d0785ab1509e37\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_496cc241aca31af9f72c91be5ce\` FOREIGN KEY (\`id_cama\`) REFERENCES \`camas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_aa35cdf1105a71438128b01dd6f\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`personal\` ADD CONSTRAINT \`FK_7c9f9239a8132547837f6fdf48b\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_d6655cf5853701ab8ac2d7d4d35\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario\` ADD CONSTRAINT \`FK_d3d3c548124be293ce31c8dfc70\` FOREIGN KEY (\`personalId\`) REFERENCES \`personal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuario\` ADD CONSTRAINT \`FK_bef018a6b31e863bf1c597a9a04\` FOREIGN KEY (\`keywordId\`) REFERENCES \`keyword\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medico\` ADD CONSTRAINT \`FK_aec4c649fc7271a07188203310d\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD CONSTRAINT \`FK_d178ce68f01e1223f87a139fe2a\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD CONSTRAINT \`FK_65e35fb5f38bd250361d3e1e4a0\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_e8827acfd8d6d3ea2863a62cecf\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_d78f51acee72939fdb7974e1678\` FOREIGN KEY (\`id_historia\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_c41caae7516a15444bd366671c8\` FOREIGN KEY (\`id_cita\`) REFERENCES \`cita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`triage\` ADD CONSTRAINT \`FK_89372ad2a89b23150969702e8eb\` FOREIGN KEY (\`id_historia\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nota\` ADD CONSTRAINT \`FK_cdea30cc3aaa07b6d2a86c1846a\` FOREIGN KEY (\`id_hospitalizacion\`) REFERENCES \`hospitalizacion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nota\` ADD CONSTRAINT \`FK_e8d78d4e10b2a19cc1500e9b8f1\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nota\` DROP FOREIGN KEY \`FK_e8d78d4e10b2a19cc1500e9b8f1\``);
        await queryRunner.query(`ALTER TABLE \`nota\` DROP FOREIGN KEY \`FK_cdea30cc3aaa07b6d2a86c1846a\``);
        await queryRunner.query(`ALTER TABLE \`triage\` DROP FOREIGN KEY \`FK_89372ad2a89b23150969702e8eb\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_c41caae7516a15444bd366671c8\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_d78f51acee72939fdb7974e1678\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_e8827acfd8d6d3ea2863a62cecf\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP FOREIGN KEY \`FK_65e35fb5f38bd250361d3e1e4a0\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP FOREIGN KEY \`FK_d178ce68f01e1223f87a139fe2a\``);
        await queryRunner.query(`ALTER TABLE \`medico\` DROP FOREIGN KEY \`FK_aec4c649fc7271a07188203310d\``);
        await queryRunner.query(`ALTER TABLE \`usuario\` DROP FOREIGN KEY \`FK_bef018a6b31e863bf1c597a9a04\``);
        await queryRunner.query(`ALTER TABLE \`usuario\` DROP FOREIGN KEY \`FK_d3d3c548124be293ce31c8dfc70\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_d6655cf5853701ab8ac2d7d4d35\``);
        await queryRunner.query(`ALTER TABLE \`personal\` DROP FOREIGN KEY \`FK_7c9f9239a8132547837f6fdf48b\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_aa35cdf1105a71438128b01dd6f\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_496cc241aca31af9f72c91be5ce\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_8cc9a856de312d0785ab1509e37\``);
        await queryRunner.query(`ALTER TABLE \`paciente\` DROP FOREIGN KEY \`FK_9e31f3fab8a3b88916c92871eba\``);
        await queryRunner.query(`ALTER TABLE \`orden\` DROP FOREIGN KEY \`FK_bbeadbd344c1998a3f31d7ce473\``);
        await queryRunner.query(`ALTER TABLE \`medicamento\` DROP FOREIGN KEY \`FK_f15f80da7ae3e8e2baab8e7942b\``);
        await queryRunner.query(`DROP TABLE \`nota\``);
        await queryRunner.query(`DROP TABLE \`triage\``);
        await queryRunner.query(`DROP TABLE \`historia\``);
        await queryRunner.query(`DROP INDEX \`REL_c41caae7516a15444bd366671c\` ON \`consulta\``);
        await queryRunner.query(`DROP TABLE \`consulta\``);
        await queryRunner.query(`DROP TABLE \`cita\``);
        await queryRunner.query(`DROP INDEX \`REL_aec4c649fc7271a07188203310\` ON \`medico\``);
        await queryRunner.query(`DROP TABLE \`medico\``);
        await queryRunner.query(`DROP INDEX \`REL_bef018a6b31e863bf1c597a9a0\` ON \`usuario\``);
        await queryRunner.query(`DROP INDEX \`REL_d3d3c548124be293ce31c8dfc7\` ON \`usuario\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP TABLE \`keyword\``);
        await queryRunner.query(`DROP INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP INDEX \`REL_7c9f9239a8132547837f6fdf48\` ON \`personal\``);
        await queryRunner.query(`DROP TABLE \`personal\``);
        await queryRunner.query(`DROP TABLE \`hospitalizacion\``);
        await queryRunner.query(`DROP TABLE \`camas\``);
        await queryRunner.query(`DROP INDEX \`REL_9e31f3fab8a3b88916c92871eb\` ON \`paciente\``);
        await queryRunner.query(`DROP TABLE \`paciente\``);
        await queryRunner.query(`DROP TABLE \`orden\``);
        await queryRunner.query(`DROP TABLE \`medicamento\``);
    }

}
