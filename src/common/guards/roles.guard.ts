import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private replector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const roles = this.replector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!roles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return roles.some((role) => user.role === role);
    }
}