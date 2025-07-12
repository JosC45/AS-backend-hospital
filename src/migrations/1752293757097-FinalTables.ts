import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';


export class FinalTables1752293757097 implements MigrationInterface {
    name = 'FinalTables1752293757097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`rol\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medico\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('asistente', 'interno', 'especialista') NOT NULL, \`especialidad\` varchar(255) NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_aec4c649fc7271a07188203310\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`consulta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`motivo_consulta\` varchar(255) NOT NULL, \`fecha_atencion\` datetime NOT NULL, \`tiempo_enfermedad\` varchar(255) NOT NULL DEFAULT '-', \`presion_arterial\` varchar(255) NOT NULL DEFAULT '-', \`latidos_pm\` varchar(255) NOT NULL DEFAULT '-', \`frecuencia_respiratoria\` varchar(255) NOT NULL DEFAULT '-', \`temperatura\` float NULL, \`peso\` varchar(255) NOT NULL DEFAULT '-', \`talla\` varchar(255) NOT NULL DEFAULT '-', \`observaciones\` varchar(255) NOT NULL DEFAULT '-', \`descripcion_diagnostico\` varchar(255) NOT NULL DEFAULT '-', \`codigo\` varchar(255) NOT NULL DEFAULT '-', \`tipo_diagnostico\` enum ('presuntivo', 'definitivo', 'repetitivo') NULL, \`tratamiento\` varchar(255) NOT NULL DEFAULT '-', \`fecha_creacion\` datetime NOT NULL, \`estado\` varchar(255) NOT NULL DEFAULT 'proceso', \`id_medico\` int NULL, \`id_historia\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`triage\` (\`id\` int NOT NULL AUTO_INCREMENT, \`motivo\` varchar(255) NOT NULL, \`presion_arterial\` varchar(255) NOT NULL DEFAULT '-', \`latidos_pm\` varchar(255) NOT NULL DEFAULT '-', \`frecuencia_respiratoria\` varchar(255) NOT NULL DEFAULT '-', \`temperatura\` float NULL, \`prioridad\` enum ('Prioridad_I', 'Prioridad_II', 'Prioridad_III', 'Prioridad_IV') NOT NULL, \`observaciones\` varchar(255) NOT NULL DEFAULT '-', \`estado\` varchar(255) NOT NULL DEFAULT 'proceso', \`fecha_creacion\` datetime NOT NULL, \`id_historia\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`historia\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha_creacion\` datetime NOT NULL, \`antecedentes_natales\` varchar(255) NULL, \`antecedentes_personales\` varchar(255) NULL, \`antecedentes_familiares\` varchar(255) NULL, \`pacienteId\` int NULL, UNIQUE INDEX \`REL_0680d485ea50a065fc8af8174a\` (\`pacienteId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paciente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`dni\` int NOT NULL, \`fecha_nacimiento\` datetime NOT NULL, \`correo\` varchar(255) NOT NULL, \`numero\` varchar(255) NOT NULL, \`domicilio\` varchar(255) NOT NULL, \`genero\` enum ('masculino', 'femenino') NOT NULL, \`seguro\` enum ('Sis', 'EsSalud', 'EPS', 'Particular') NOT NULL, \`tipo_sangre\` varchar(255) NOT NULL, \`historiaId\` int NULL, UNIQUE INDEX \`REL_9e31f3fab8a3b88916c92871eb\` (\`historiaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cita\` (\`id\` int NOT NULL AUTO_INCREMENT, \`especialidad\` enum ('emergencia', 'consultorio_externo', 'hospitalizacion') NOT NULL, \`fecha_atencion\` datetime NOT NULL, \`motivo\` varchar(255) NOT NULL, \`id_paciente\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hospitalizacion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`intervencion\` enum ('triaje', 'consulta') NOT NULL, \`id_intervencion\` int NOT NULL, \`fecha_ingreso\` datetime NOT NULL, \`estado\` enum ('hospitalizado', 'alta') NOT NULL, \`diagnostico_ingreso\` varchar(255) NOT NULL, \`area_destino\` enum ('medicina_interna', 'cirugia', 'pediatria', 'ginecologia', 'uci') NOT NULL, \`diagnostico_alta\` varchar(255) NULL, \`diagnostico_secundario\` varchar(255) NULL, \`tratamiento_realizado\` varchar(255) NULL, \`recomendaciones_hogar\` varchar(255) NULL, \`pronostico\` varchar(255) NULL, \`fecha_salida\` datetime NULL, \`id_cama\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`camas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`piso\` varchar(255) NOT NULL, \`cama\` varchar(255) NOT NULL, \`estado\` enum ('disponible', 'ocupada', 'mantenimiento') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nota\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(255) NOT NULL, \`fecha_creacion\` datetime NOT NULL, \`id_hospitalizacion\` int NULL, \`id_medico\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orden\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lugar_emision\` varchar(255) NOT NULL, \`diagnostico_principal\` varchar(255) NOT NULL, \`indicaciones_terapeuticas\` varchar(255) NOT NULL, \`fecha_creacion\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id_paciente\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medicamento\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`presentacion\` varchar(255) NOT NULL, \`dosis\` int NOT NULL, \`via_administracion\` varchar(255) NOT NULL, \`frecuencia\` varchar(255) NOT NULL, \`duracion\` varchar(255) NOT NULL, \`id_orden\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`personal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`tipo\` enum ('secretaria', 'cajera') NOT NULL, \`usuarioId\` int NULL, UNIQUE INDEX \`REL_7c9f9239a8132547837f6fdf48\` (\`usuarioId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_d6655cf5853701ab8ac2d7d4d35\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medico\` ADD CONSTRAINT \`FK_aec4c649fc7271a07188203310d\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_e8827acfd8d6d3ea2863a62cecf\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`consulta\` ADD CONSTRAINT \`FK_d78f51acee72939fdb7974e1678\` FOREIGN KEY (\`id_historia\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`triage\` ADD CONSTRAINT \`FK_89372ad2a89b23150969702e8eb\` FOREIGN KEY (\`id_historia\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historia\` ADD CONSTRAINT \`FK_0680d485ea50a065fc8af8174a4\` FOREIGN KEY (\`pacienteId\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`paciente\` ADD CONSTRAINT \`FK_9e31f3fab8a3b88916c92871eba\` FOREIGN KEY (\`historiaId\`) REFERENCES \`historia\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD CONSTRAINT \`FK_d178ce68f01e1223f87a139fe2a\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cita\` ADD CONSTRAINT \`FK_65e35fb5f38bd250361d3e1e4a0\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_496cc241aca31af9f72c91be5ce\` FOREIGN KEY (\`id_cama\`) REFERENCES \`camas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` ADD CONSTRAINT \`FK_aa35cdf1105a71438128b01dd6f\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nota\` ADD CONSTRAINT \`FK_cdea30cc3aaa07b6d2a86c1846a\` FOREIGN KEY (\`id_hospitalizacion\`) REFERENCES \`hospitalizacion\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nota\` ADD CONSTRAINT \`FK_e8d78d4e10b2a19cc1500e9b8f1\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orden\` ADD CONSTRAINT \`FK_bbeadbd344c1998a3f31d7ce473\` FOREIGN KEY (\`id_paciente\`) REFERENCES \`paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medicamento\` ADD CONSTRAINT \`FK_f15f80da7ae3e8e2baab8e7942b\` FOREIGN KEY (\`id_orden\`) REFERENCES \`orden\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`personal\` ADD CONSTRAINT \`FK_7c9f9239a8132547837f6fdf48b\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
        INSERT INTO camas (piso, cama, estado) VALUES
        -- DISPONIBLES (40%) - 38 camas
        ${Array.from({ length: 38 }, (_, i) => {
            const piso = i < 13 ? 'Piso 1' : i < 26 ? 'Piso 2' : 'Piso 3';
            return `('${piso}', 'Cama ${i + 1}', 'disponible')`;
        }).join(',')},
        
        -- OCUPADAS (40%) - 38 camas
        ${Array.from({ length: 38 }, (_, i) => {
            const idx = i + 38;
            const piso = idx < 51 ? 'Piso 1' : idx < 64 ? 'Piso 2' : 'Piso 3';
            return `('${piso}', 'Cama ${idx + 1}', 'ocupada')`;
        }).join(',')},
        
        -- MANTENIMIENTO (20%) - 20 camas
        ${Array.from({ length: 20 }, (_, i) => {
            const idx = i + 76;
            const piso = idx < 83 ? 'Piso 1' : idx < 90 ? 'Piso 2' : 'Piso 3';
            return `('${piso}', 'Cama ${idx + 1}', 'mantenimiento')`;
        }).join(',')};
        `);
        const dnis = [
            '62435307', '48491739', '48756252', // Admins
            '89567379', '10713407', '71418878', // Personal
            '71919280', '67888220', '17778606', '59742558', '20721973',
            '81678669', '61981098', '46299230', '43832502', '22558620' // Médicos
          ];
      
          const roles = [
            'admin', 'admin', 'admin',
            'personal', 'personal', 'personal',
            'medico', 'medico', 'medico', 'medico', 'medico',
            'medico', 'medico', 'medico', 'medico', 'medico'
          ];
      
          const estado = 'activo';
      
          // 1. Insertar usuarios con hashing
          for (let i = 0; i < dnis.length; i++) {
            const username = dnis[i];
            const passwordHash = await bcrypt.hash(dnis[i], 12);
            const rol = roles[i];
      
            await queryRunner.query(
              `INSERT INTO usuario (username, password, rol, estado) VALUES (?, ?, ?, ?)`,
              [username, passwordHash, rol, estado]
            );
          }
      
          // 2. Insertar Admins
          await queryRunner.query(`
            INSERT INTO admin (nombres, apellidos, correo, dni, usuarioId) VALUES
            ('Curro', 'Villalba', 'mireia27@ribas.es', '62435307', 1),
            ('Lino', 'Fabregat', 'valdesruperta@gmail.com', '48491739', 2),
            ('Buenaventura', 'Tamarit', 'domingosegui@alemany-salgado.es', '48756252', 3)
          `);
      
          // 3. Insertar Personal
          await queryRunner.query(`
            INSERT INTO personal (nombres, apellidos, correo, dni, tipo, usuarioId) VALUES
            ('Fidela', 'Garcés', 'camachoapolonia@gmail.com', '89567379', 'secretaria', 4),
            ('Natalia', 'Morcillo', 'rodrigoescolano@cases-talavera.com', '10713407', 'cajera', 5),
            ('Candelas', 'Boix', 'cabelloesteban@gmail.com', '71418878', 'secretaria', 6)
          `);
      
          // 4. Insertar Médicos
          await queryRunner.query(`
            INSERT INTO medico (nombres, apellidos, correo, dni, tipo, especialidad, usuarioId) VALUES
            ('Tito', 'Font', 'barberoevaristo@gmail.com', '71919280', 'interno', 'Chemical engineer', 7),
            ('Eloy', 'Armengol', 'pfabregas@gmail.com', '67888220', 'interno', 'Licensed conveyancer', 8),
            ('Hilda', 'Clavero', 'manzanaresnacio@perez.com', '17778606', 'asistente', 'Statistician', 9),
            ('Berto', 'Canet', 'joel28@lago.es', '59742558', 'asistente', 'Conservator, furniture', 10),
            ('Raquel', 'Riera', 'pancho50@velazquez-acedo.org', '20721973', 'interno', 'Multimedia specialist', 11),
            ('Loida', 'Espejo', 'ucalvo@hotmail.com', '81678669', 'especialista', 'Engineer, civil (contracting)', 12),
            ('Sabas', 'Bejarano', 'lorenzapalma@terron-luque.com', '61981098', 'especialista', 'Aid worker', 13),
            ('Juan Bautista', 'Anguita', 'pioespejo@cerezo.com', '46299230', 'interno', 'Community development worker', 14),
            ('Teodora', 'Beltrán', 'iniguezponcio@gmail.com', '43832502', 'interno', 'Paediatric nurse', 15),
            ('Cirino', 'Juan', 'murcialuciano@mendez.com', '22558620', 'asistente', 'Clinical scientist', 16)
          `);
          await queryRunner.query(`INSERT INTO paciente (nombres, apellidos, dni, fecha_nacimiento, correo, numero, domicilio, genero, seguro, tipo_sangre)
            VALUES 
            ('Juan', 'Pérez', 12345678, '1990-01-01', 'juan@example.com', '987654320', 'Av. Lima 123', 'masculino', 'EsSalud', 'O+'),
            ('María', 'Gómez', 23456789, '1990-01-02', 'maria@example.com', '987654321', 'Jr. Arequipa 456', 'femenino', 'EPS', 'A+'),
            ('Pedro', 'Rodríguez', 34567890, '1990-01-03', 'pedro@example.com', '987654322', 'Calle Cusco 789', 'masculino', 'Sis', 'B+'),
            ('Lucía', 'Fernández', 45678901, '1990-01-04', 'lucia@example.com', '987654323', 'Pasaje Piura 101', 'femenino', 'Particular', 'AB-'),
            ('José', 'López', 56789012, '1990-01-05', 'jose@example.com', '987654324', 'Av. Puno 112', 'masculino', 'EsSalud', 'A-'),
            ('Ana', 'Martínez', 67890123, '1990-01-06', 'ana@example.com', '987654325', 'Jr. Tacna 131', 'femenino', 'EPS', 'B-'),
            ('Luis', 'García', 78901234, '1990-01-07', 'luis@example.com', '987654326', 'Calle Ica 415', 'masculino', 'Sis', 'O-'),
            ('Carmen', 'Sánchez', 89012345, '1990-01-08', 'carmen@example.com', '987654327', 'Av. Loreto 162', 'femenino', 'Particular', 'AB+'),
            ('Carlos', 'Ramírez', 90123456, '1990-01-09', 'carlos@example.com', '987654328', 'Jr. Junin 911', 'masculino', 'EsSalud', 'A+'),
            ('Elena', 'Torres', 12345679, '1990-01-10', 'elena@example.com', '987654329', 'Calle Cajamarca 202', 'femenino', 'EPS', 'O+');
          `);
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO historia (fecha_creacion, antecedentes_natales, antecedentes_personales, antecedentes_familiares, pacienteId)
        //       VALUES (NOW(), 'Ninguno', 'Asma', 'Diabetes', ${i});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO triage (motivo, presion_arterial, latidos_pm, frecuencia_respiratoria, temperatura, prioridad, observaciones, estado, fecha_creacion, id_historia)
        //       VALUES ('Dolor agudo', '120/80', '80', '20', 37.5, 'Prioridad_I', 'Paciente alerta', 'proceso', NOW(), ${i});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     const especialidad = ['emergencia', 'consultorio_externo', 'hospitalizacion'][i % 3];
        //     await queryRunner.query(`
        //       INSERT INTO cita (especialidad, fecha_atencion, motivo, id_paciente, id_medico)
        //       VALUES ('${especialidad}', NOW(), 'Consulta general', ${i}, ${((i - 1) % 10) + 1});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO consulta (motivo_consulta, fecha_atencion, tiempo_enfermedad, presion_arterial, latidos_pm, frecuencia_respiratoria, temperatura, peso, talla, observaciones, descripcion_diagnostico, codigo, tipo_diagnostico, tratamiento, fecha_creacion, estado, id_medico, id_historia)
        //       VALUES ('Dolor estomacal', NOW(), '2 días', '120/70', '85', '19', 36.5, '65kg', '1.70m', 'Paciente estable', 'Gastritis', 'K29', 'presuntivo', 'Omeprazol', NOW(), 'proceso', ${((i - 1) % 10) + 1}, ${i});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO hospitalizacion (intervencion, id_intervencion, fecha_ingreso, estado, diagnostico_ingreso, area_destino, id_cama, id_medico)
        //       VALUES ('triaje', ${i}, NOW(), 'hospitalizado', 'Fiebre alta', 'medicina_interna', ${((i - 1) % 32) + 1}, ${((i - 1) % 10) + 1});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO nota (descripcion, fecha_creacion, id_hospitalizacion, id_medico)
        //       VALUES ('Paciente con evolución favorable', NOW(), ${i}, ${((i - 1) % 10) + 1});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO orden (lugar_emision, diagnostico_principal, indicaciones_terapeuticas, id_paciente)
        //       VALUES ('Hospital Central', 'Dolor abdominal', 'Reposo y medicación', ${i});
        //     `);
        //   }
        //   for (let i = 1; i <= 10; i++) {
        //     await queryRunner.query(`
        //       INSERT INTO medicamento (nombre, presentacion, dosis, via_administracion, frecuencia, duracion, id_orden)
        //       VALUES ('Paracetamol', 'tabletas', 500, 'oral', 'cada 8h', '5 días', ${i});
        //     `);
        // }
        await queryRunner.query(`
            INSERT INTO historia (fecha_creacion, antecedentes_natales, antecedentes_personales, antecedentes_familiares, pacienteId) VALUES
            (NOW(), 'Normal', 'Ninguno', 'Hipertensión', 1),
            (NOW(), 'Normal', 'Asma', 'Diabetes', 2),
            (NOW(), 'Normal', 'Alergias', 'Hipertensión', 3),
            (NOW(), 'Normal', 'Obesidad', 'Ninguno', 4),
            (NOW(), 'Normal', 'Tabaquismo', 'Diabetes', 5),
            (NOW(), 'Normal', 'Estrés', 'Hipertensión', 6),
            (NOW(), 'Normal', 'Depresión', 'Ninguno', 7),
            (NOW(), 'Normal', 'Migraña', 'Diabetes', 8),
            (NOW(), 'Normal', 'Asma', 'Hipertensión', 9),
            (NOW(), 'Normal', 'Ninguno', 'Ninguno', 10);
        `);
        await queryRunner.query(`
            INSERT INTO triage (motivo, presion_arterial, latidos_pm, frecuencia_respiratoria, temperatura, prioridad, observaciones, estado, fecha_creacion, id_historia) VALUES
            ('Fiebre', '120/80', '80', '18', 37.5, 'Prioridad_I', 'Caliente', 'proceso', NOW(), 1),
            ('Dolor cabeza', '110/70', '75', '17', 36.8, 'Prioridad_II', 'Leve', 'proceso', NOW(), 2),
            ('Dolor abdominal', '125/85', '85', '20', 38.0, 'Prioridad_I', 'Moderado', 'proceso', NOW(), 3),
            ('Tos', '115/75', '78', '19', 37.0, 'Prioridad_III', 'Seca', 'proceso', NOW(), 4),
            ('Vómitos', '130/90', '88', '22', 38.5, 'Prioridad_II', 'Frecuente', 'proceso', NOW(), 5),
            ('Mareos', '118/76', '82', '18', 37.2, 'Prioridad_III', 'Leve', 'proceso', NOW(), 6),
            ('Herida', '122/80', '80', '18', 36.9, 'Prioridad_I', 'Profunda', 'proceso', NOW(), 7),
            ('Dolor torácico', '140/90', '95', '22', 37.8, 'Prioridad_I', 'Intenso', 'proceso', NOW(), 8),
            ('Dolor espalda', '120/80', '78', '19', 36.7, 'Prioridad_IV', 'Moderado', 'proceso', NOW(), 9),
            ('Falta aire', '135/92', '100', '24', 38.1, 'Prioridad_I', 'Grave', 'proceso', NOW(), 10);
        `);
        await queryRunner.query(`
            INSERT INTO cita (especialidad, fecha_atencion, motivo, id_paciente, id_medico) VALUES
            ('emergencia', NOW(), 'Revisión', 1, 1),
            ('consultorio_externo', NOW(), 'Control', 2, 2),
            ('hospitalizacion', NOW(), 'Ingreso', 3, 3),
            ('emergencia', NOW(), 'Dolor', 4, 4),
            ('consultorio_externo', NOW(), 'Chequeo', 5, 5),
            ('hospitalizacion', NOW(), 'Evaluación', 6, 6),
            ('emergencia', NOW(), 'Control', 7, 7),
            ('consultorio_externo', NOW(), 'Revisión', 8, 8),
            ('hospitalizacion', NOW(), 'Ingreso', 9, 9),
            ('emergencia', NOW(), 'Chequeo', 10, 10);
        `);
        await queryRunner.query(`
            INSERT INTO consulta (motivo_consulta, fecha_atencion, tiempo_enfermedad, presion_arterial, latidos_pm, frecuencia_respiratoria, temperatura, peso, talla, observaciones, descripcion_diagnostico, codigo, tipo_diagnostico, tratamiento, fecha_creacion, estado, id_medico, id_historia) VALUES
            ('Dolor espalda', NOW(), '3 días', '120/80', '80', '18', 36.8, '70kg', '1.75', 'Bien', 'Esguince', 'M54', 'presuntivo', 'Ibuprofeno', NOW(), 'proceso', 1, 1),
            ('Dolor cabeza', NOW(), '1 día', '110/70', '75', '17', 36.7, '65kg', '1.70', 'Menos', 'Migraña', 'G43', 'presuntivo', 'Paracetamol', NOW(), 'proceso', 2, 2),
            ('Fiebre', NOW(), '2 días', '115/75', '78', '19', 37.2, '68kg', '1.68', 'Mejor', 'Infección', 'A41', 'presuntivo', 'Amoxicilina', NOW(), 'proceso', 3, 3),
            ('Dolor abdominal', NOW(), '4 días', '125/85', '85', '20', 38.1, '72kg', '1.80', 'Estable', 'Gastritis', 'K29', 'presuntivo', 'Omeprazol', NOW(), 'proceso', 4, 4),
            ('Tos', NOW(), '5 días', '118/76', '82', '18', 36.9, '60kg', '1.60', 'Leve', 'Bronquitis', 'J20', 'presuntivo', 'Broncodilatadores', NOW(), 'proceso', 5, 5),
            ('Mareos', NOW(), '1 día', '122/80', '80', '18', 36.5, '75kg', '1.85', 'Estable', 'Hipotensión', 'I95', 'presuntivo', 'Hidratación', NOW(), 'proceso', 6, 6),
            ('Herida', NOW(), '2 días', '130/90', '88', '22', 37.0, '80kg', '1.90', 'Control', 'Corte', 'S01', 'presuntivo', 'Pólizaychero', NOW(), 'proceso', 7, 7),
            ('Dolor torácico', NOW(), '3 días', '140/90', '95', '22', 37.5, '90kg', '1.95', 'Grave', 'Infarto', 'I21', 'presuntivo', 'AAS', NOW(), 'proceso', 8, 8),
            ('Falta aire', NOW(), '2 días', '135/92', '100', '24', 38.3, '85kg', '1.75', 'Urgente', 'Asma', 'J45', 'presuntivo', 'Ventilación', NOW(), 'proceso', 9, 9),
            ('Fiebre', NOW(), '7 días', '128/88', '85', '20', 38.6, '78kg', '1.78', 'Estable', 'Dengue', 'A90', 'presuntivo', 'Rehidratación', NOW(), 'proceso', 10, 10);
        `);
        await queryRunner.query(`
            INSERT INTO hospitalizacion (intervencion, id_intervencion, fecha_ingreso, estado, diagnostico_ingreso, area_destino, id_cama, id_medico) VALUES
            ('triaje', 1, NOW(), 'hospitalizado', 'Gripe', 'medicina_interna', 1, 1),
            ('triaje', 2, NOW(), 'hospitalizado', 'Neumonía', 'uci', 2, 2),
            ('consulta', 3, NOW(), 'hospitalizado', 'Fractura', 'cirugia', 3, 3),
            ('consulta', 4, NOW(), 'hospitalizado', 'Migraña', 'medicina_interna', 4, 4),
            ('triaje', 5, NOW(), 'hospitalizado', 'Apendicitis', 'cirugia', 5, 5),
            ('consulta', 6, NOW(), 'hospitalizado', 'Asma', 'uci', 6, 6),
            ('triaje', 7, NOW(), 'hospitalizado', 'Dengue', 'medicina_interna', 7, 7),
            ('consulta', 8, NOW(), 'hospitalizado', 'Hipertensión', 'cirugia', 8, 8),
            ('triaje', 9, NOW(), 'hospitalizado', 'Diabetes', 'uci', 9, 9),
            ('consulta', 10, NOW(), 'hospitalizado', 'Insuficiencia renal', 'medicina_interna', 10, 10);
        `);
        await queryRunner.query(`
            INSERT INTO nota (descripcion, fecha_creacion, id_hospitalizacion, id_medico) VALUES
            ('Evolución bien', NOW(), 1, 1),
            ('Paciente estable', NOW(), 2, 2),
            ('Mejoría marcada', NOW(), 3, 3),
            ('Monitorización continua', NOW(), 4, 4),
            ('Alta próxima', NOW(), 5, 5),
            ('Control diario', NOW(), 6, 6),
            ('Reposo necesario', NOW(), 7, 7),
            ('Tratamiento cambiado', NOW(), 8, 8),
            ('Buen estado', NOW(), 9, 9),
            ('Falta seguimiento', NOW(), 10, 10);
        `);
        await queryRunner.query(`
            INSERT INTO orden (lugar_emision, diagnostico_principal, indicaciones_terapeuticas, id_paciente) VALUES
            ('Hospital Central', 'Gripe', 'Reposo', 1),
            ('Hospital Regional', 'Neumonía', 'Antibióticos', 2),
            ('Clínica XYZ', 'Fractura', 'Inmovilización', 3),
            ('Centro Salud', 'Migraña', 'Calmantes', 4),
            ('Hospital Central', 'Apendicitis', 'Cirugía', 5),
            ('Clínica ABC', 'Asma', 'Inhaladores', 6),
            ('Hospital Regional', 'Dengue', 'Hidratación', 7),
            ('Clínica 123', 'Hipertensión', 'Dieta', 8),
            ('Centro Salud', 'Diabetes', 'Insulina', 9),
            ('Hospital Central', 'Renal', 'Diálisis', 10);
        `);
        await queryRunner.query(`
            INSERT INTO medicamento (nombre, presentacion, dosis, via_administracion, frecuencia, duracion, id_orden) VALUES
            ('Paracetamol', 'tabletas', 500, 'oral', 'cada 8h', '5 días', 1),
            ('Ibuprofeno', 'tabletas', 400, 'oral', 'cada 6h', '7 días', 2),
            ('Amoxicilina', 'cápsulas', 500, 'oral', 'cada 8h', '10 días', 3),
            ('Omeprazol', 'cápsulas', 20, 'oral', 'cada 24h', '14 días', 4),
            ('Ventolin', 'inhalador', 2, 'inhalación', 'cada 6h', '7 días', 5),
            ('Losartán', 'tabletas', 50, 'oral', 'cada 24h', '30 días', 6),
            ('Metformina', 'tabletas', 850, 'oral', 'cada 12h', '60 días', 7),
            ('AAS', 'tabletas', 100, 'oral', 'cada 24h', '30 días', 8),
            ('Diclofenaco', 'tabletas', 50, 'oral', 'cada 8h', '5 días', 9),
            ('Enalapril', 'tabletas', 10, 'oral', 'cada 24h', '30 días', 10);
        `);    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`personal\` DROP FOREIGN KEY \`FK_7c9f9239a8132547837f6fdf48b\``);
        await queryRunner.query(`ALTER TABLE \`medicamento\` DROP FOREIGN KEY \`FK_f15f80da7ae3e8e2baab8e7942b\``);
        await queryRunner.query(`ALTER TABLE \`orden\` DROP FOREIGN KEY \`FK_bbeadbd344c1998a3f31d7ce473\``);
        await queryRunner.query(`ALTER TABLE \`nota\` DROP FOREIGN KEY \`FK_e8d78d4e10b2a19cc1500e9b8f1\``);
        await queryRunner.query(`ALTER TABLE \`nota\` DROP FOREIGN KEY \`FK_cdea30cc3aaa07b6d2a86c1846a\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_aa35cdf1105a71438128b01dd6f\``);
        await queryRunner.query(`ALTER TABLE \`hospitalizacion\` DROP FOREIGN KEY \`FK_496cc241aca31af9f72c91be5ce\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP FOREIGN KEY \`FK_65e35fb5f38bd250361d3e1e4a0\``);
        await queryRunner.query(`ALTER TABLE \`cita\` DROP FOREIGN KEY \`FK_d178ce68f01e1223f87a139fe2a\``);
        await queryRunner.query(`ALTER TABLE \`paciente\` DROP FOREIGN KEY \`FK_9e31f3fab8a3b88916c92871eba\``);
        await queryRunner.query(`ALTER TABLE \`historia\` DROP FOREIGN KEY \`FK_0680d485ea50a065fc8af8174a4\``);
        await queryRunner.query(`ALTER TABLE \`triage\` DROP FOREIGN KEY \`FK_89372ad2a89b23150969702e8eb\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_d78f51acee72939fdb7974e1678\``);
        await queryRunner.query(`ALTER TABLE \`consulta\` DROP FOREIGN KEY \`FK_e8827acfd8d6d3ea2863a62cecf\``);
        await queryRunner.query(`ALTER TABLE \`medico\` DROP FOREIGN KEY \`FK_aec4c649fc7271a07188203310d\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_d6655cf5853701ab8ac2d7d4d35\``);
        await queryRunner.query(`DROP INDEX \`REL_7c9f9239a8132547837f6fdf48\` ON \`personal\``);
        await queryRunner.query(`DROP TABLE \`personal\``);
        await queryRunner.query(`DROP TABLE \`medicamento\``);
        await queryRunner.query(`DROP TABLE \`orden\``);
        await queryRunner.query(`DROP TABLE \`nota\``);
        await queryRunner.query(`DROP TABLE \`camas\``);
        await queryRunner.query(`DROP TABLE \`hospitalizacion\``);
        await queryRunner.query(`DROP TABLE \`cita\``);
        await queryRunner.query(`DROP INDEX \`REL_9e31f3fab8a3b88916c92871eb\` ON \`paciente\``);
        await queryRunner.query(`DROP TABLE \`paciente\``);
        await queryRunner.query(`DROP INDEX \`REL_0680d485ea50a065fc8af8174a\` ON \`historia\``);
        await queryRunner.query(`DROP TABLE \`historia\``);
        await queryRunner.query(`DROP TABLE \`triage\``);
        await queryRunner.query(`DROP TABLE \`consulta\``);
        await queryRunner.query(`DROP INDEX \`REL_aec4c649fc7271a07188203310\` ON \`medico\``);
        await queryRunner.query(`DROP TABLE \`medico\``);
        await queryRunner.query(`DROP INDEX \`REL_d6655cf5853701ab8ac2d7d4d3\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
    }

}
