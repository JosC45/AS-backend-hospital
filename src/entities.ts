import { Admin } from "./admin/entities/admin.entity";
import { Consulta } from "./consultas/entities/consulta.entity";
import { Historia } from "./historias/entities/historia.entity";
import { Camas } from "./hospitalizacion/entities/camas.entity";
import { Hospitalizacion } from "./hospitalizacion/entities/hospitalizacion.entity";
import { Medico } from "./medicos/entities/medico.entity";
import { Nota } from "./notas/entities/nota.entity";
import { Paciente } from "./pacientes/entities/paciente.entity";
import { Personal } from "./personal/entities/personal.entity";
import { Triage } from "./triages/entities/triage.entity";
import { Usuario } from "./usuario/entities/usuario.entity";

export const ENTITIES=[Usuario,Paciente,Triage,Medico,Personal,Admin,Historia,Consulta,Hospitalizacion,Camas,Nota]