import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt'

export class KeywordRegister1764131018166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const keywords= ['Alianza1901','Alianza1902','Alianza1903','Alianza1904','Alianza1905']

        for (let i = 0; i < keywords.length; i++) {
            const plain = keywords[i];
            const hashed = await bcrypt.hash(plain, 10);

            await queryRunner.query(
                `INSERT INTO defaultdb.keyword (palabra_clave) VALUES (?)`,
                [hashed]
            );

            await queryRunner.query(
                `UPDATE defaultdb.usuario SET keywordId = ? WHERE id = ?`,
                [i + 1, i + 1] 
            );
            }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM defaultdb.keyword`);
    }

}
