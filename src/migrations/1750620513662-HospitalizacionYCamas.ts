import { MigrationInterface, QueryRunner } from "typeorm";

export class HospitalizacionYCamas1750620513662 implements MigrationInterface {
    name = 'HospitalizacionYCamas1750620513662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`camas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`piso\` enum ('piso1', 'piso2', 'piso3') NOT NULL, \`cama\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hospitalizacion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha_ingreso\` datetime NOT NULL, \`fecha_salida\` datetime NULL, \`estado\` enum ('activa', 'alta') NOT NULL, \`diagnostico_ingreso\` varchar(255) NOT NULL, \`recomendaciones_medicas\` varchar(255) NOT NULL, \`plan_seguimiento\` varchar(255) NOT NULL, \`id_paciente\` int NULL, \`id_cama\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_8cc9a856de312d0785ab1509e37\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_496cc241aca31af9f72c91be5ce\` FOREIGN KEY (\`id_cama\`) REFERENCES \`camas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            INSERT INTO \`camas\` (id,piso,cama) 
            VALUES
            (1,"piso1",1),
            (2,"piso1",2),
            (3,"piso1",3),
            (4,"piso2",1),
            (5,"piso2",2),
            (6,"piso2",3),
            (7,"piso3",1),
            (8,"piso3",2);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_496cc241aca31af9f72c91be5ce\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_8cc9a856de312d0785ab1509e37\``);
        await queryRunner.query(`DROP TABLE \`hospitalizacion\``);
        //await queryRunner.query(`DELETE FROM \`camas\` WHERE id IN (1,2,3,4,5,6,7,8)`);
        await queryRunner.query(`DROP TABLE \`camas\``);
    }

}
