import{
    Injectable,
    CanActivate,
    ExecutionContext
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Observable } from 'rxjs'

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles=this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRoles) return true;
        console.log('Required roles:', requiredRoles);
        const {user}=context.switchToHttp().getRequest();
        console.log('User:', user);
        return requiredRoles.includes(user.role)
    }
}