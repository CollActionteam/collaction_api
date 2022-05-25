import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './guards';
import { AuthService } from './service';

@Global()
@Module({
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}
