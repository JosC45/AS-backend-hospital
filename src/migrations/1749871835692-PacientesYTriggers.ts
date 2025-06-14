import { MigrationInterface, QueryRunner } from "typeorm";

export class PacientesYTriggers1749871835692 implements MigrationInterface {
    name = 'PacientesYTriggers1749871835692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`triage\` (\`id\` int NOT NULL AUTO_INCREMENT, \`latidos_pm\` varchar(255) NOT NULL, \`presion_arterial\` varchar(255) NOT NULL, \`temperatura\` int NOT NULL, \`prioridad\` enum ('muy_alta', 'alta', 'regular', 'bajo', 'muy bajo') NOT NULL, \`motivo\` varchar(255) NOT NULL, \`observaciones\` varchar(255) NOT NULL, \`id_paciente\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`triage\` ADD CONSTRAINT \`FK_74bc6fa341bbe07eb3c86d2f013\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`triage\` DROP FOREIGN KEY \`FK_74bc6fa341bbe07eb3c86d2f013\``);
        await queryRunner.query(`DROP TABLE \`triage\``);
    }

}
