import { Admin } from "./admin/entities/admin.entity";
import { Historia } from "./historias/entities/historia.entity";
import { Medico } from "./medicos/entities/medico.entity";
import { Paciente } from "./pacientes/entities/paciente.entity";
import { Personal } from "./personal/entities/personal.entity";
import { Triage } from "./triages/entities/triage.entity";
import { Usuario } from "./usuario/entities/usuario.entity";

export const ENTITIES=[Usuario,Paciente,Triage,Medico,Personal,Admin,Historia]