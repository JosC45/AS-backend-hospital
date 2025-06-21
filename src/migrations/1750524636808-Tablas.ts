import { MigrationInterface, QueryRunner } from "typeorm";

export class Tablas1750524636808 implements MigrationInterface {
    name = 'Tablas1750524636808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`rol\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medico\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('asistente', 'interno', 'especialista') NOT NULL, \`especialidad\` varchar(255) NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_aec4c649fc7271a07188203310\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`triage\` (\`id\` int NOT NULL AUTO_INCREMENT, \`latidos_pm\` varchar(255) NOT NULL, \`presion_arterial\` varchar(255) NOT NULL, \`temperatura\` int NOT NULL, \`prioridad\` enum ('muy_alta', 'alta', 'regular', 'bajo', 'muy bajo') NOT NULL, \`motivo\` varchar(255) NOT NULL, \`observaciones\` varchar(255) NOT NULL, \`id_paciente\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paciente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` int NOT NULL, \`fecha_nacimiento\` datetime NOT NULL, \`domicilio\` varchar(255) NOT NULL, \`tipo_sangre\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`personal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('secretaria', 'cajera') NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_7c9f9239a8132547837f6fdf48\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_d6655cf5853701ab8ac2d7d4d35\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medico\` ADD CONSTRAINT \`FK_aec4c649fc7271a07188203310d\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`triage\` ADD CONSTRAINT \`FK_74bc6fa341bbe07eb3c86d2f013\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`personal\` ADD CONSTRAINT \`FK_7c9f9239a8132547837f6fdf48b\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`personal\` DROP FOREIGN KEY \`FK_7c9f9239a8132547837f6fdf48b\``);
        await queryRunner.query(`ALTER TABLE \`triage\` DROP FOREIGN KEY \`FK_74bc6fa341bbe07eb3c86d2f013\``);
        await queryRunner.query(`ALTER TABLE \`medico\` DROP FOREIGN KEY \`FK_aec4c649fc7271a07188203310d\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_d6655cf5853701ab8ac2d7d4d35\``);
        await queryRunner.query(`DROP INDEX \`REL_7c9f9239a8132547837f6fdf48\` ON \`personal\``);
        await queryRunner.query(`DROP TABLE \`personal\``);
        await queryRunner.query(`DROP TABLE \`paciente\``);
        await queryRunner.query(`DROP TABLE \`triage\``);
        await queryRunner.query(`DROP INDEX \`REL_aec4c649fc7271a07188203310\` ON \`medico\``);
        await queryRunner.query(`DROP TABLE \`medico\``);
        await queryRunner.query(`DROP INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
    }

}
