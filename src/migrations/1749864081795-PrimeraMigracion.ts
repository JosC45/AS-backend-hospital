import { MigrationInterface, QueryRunner } from "typeorm";

export class PrimeraMigracion1749864081795 implements MigrationInterface {
    name = 'PrimeraMigracion1749864081795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`paciente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` int NOT NULL, \`fecha_nacimiento\` datetime NOT NULL, \`domicilio\` varchar(255) NOT NULL, \`tipo_sangre\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`contraseña\` varchar(255) NOT NULL, \`dni\` int NOT NULL, \`rol\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP TABLE \`paciente\``);
    }

}
