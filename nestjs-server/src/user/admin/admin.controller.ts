import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
@Controller('/api/v1/admin')
@ApiBearerAuth('access-token')
@ApiTags('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
  constructor() {}
  @Roles('admin')
  @Get('/')
  async check() {
    return 'admin';
  }
}
