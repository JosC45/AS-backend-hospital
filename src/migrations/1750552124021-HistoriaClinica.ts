import { MigrationInterface, QueryRunner } from "typeorm";

export class HistoriaClinica1750552124021 implements MigrationInterface {
    name = 'HistoriaClinica1750552124021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`historia\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo_consulta\` enum ('nueva', 'seguimiento', 'post-operatorio') NOT NULL, \`motivo_consulta\` varchar(255) NOT NULL, \`resultado_y_diagnostico\` varchar(255) NOT NULL, \`comentarios_adicionales\` varchar(255) NOT NULL, \`fecha_creacion\` datetime NOT NULL, \`id_paciente\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`historia\` ADD CONSTRAINT \`FK_a399c7f3bea6e758bd61fbf7ff1\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historia\` ADD CONSTRAINT \`FK_4cd7cd9f9e74958b27905ae1b0c\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historia\` DROP FOREIGN KEY \`FK_4cd7cd9f9e74958b27905ae1b0c\``);
        await queryRunner.query(`ALTER TABLE \`historia\` DROP FOREIGN KEY \`FK_a399c7f3bea6e758bd61fbf7ff1\``);
        await queryRunner.query(`DROP TABLE \`historia\``);
    }

}
