import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { MongoExceptionFilter } from '../filters/mongo.filter';
import { UserService } from '../user.service';
import { Appointments } from './appointments.schema';
import { Doctor } from './doctor.schema';
import { DoctorService } from './doctor.service';
@Controller('/api/v1/doctor')
@ApiBearerAuth('access-token')
@ApiTags('Doctor')
@UseGuards(JwtGuard, RolesGuard)
export class DoctorController {
  constructor(
    private doctorService: DoctorService,
    private userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Get all doctors(Admin only)',
    description: 'Get all doctors(Admin only)',
  })
  @Roles('admin')
  @Get('/')
  @ApiResponse({ type: Doctor, status: 200, isArray: true })
  async getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @Roles('admin', 'patient')
  @ApiOperation({ summary: 'Add doctor (Admin and patients Only allowed)' })
  @Post('/')
  @UseFilters(MongoExceptionFilter)
  @ApiResponse({ type: Doctor, status: 200 })
  async createDoctor(@Body() userDetails: SignUpDto) {
    const user = await this.userService.register(userDetails);
    if (user) {
      return { status: 200, message: 'doctor account created' };
    } else {
      throw new InternalServerErrorException('doctor account creation failed');
    }
  }

  @Roles('admin', 'doctor')
  @Get('/profile/:id')
  @ApiOperation({
    summary:
      "Get Doctor's profile by id (Doctor can view only his profile,Admin Can view All profiles",
  })
  async getDoctor(@Param('id') id: string, @Request() req) {
    if (req.user.role === 'doctor') {
      if (req.user.userId.toString() === id) {
        return this.doctorService.getDoctor(id);
      } else {
        throw new UnauthorizedException(
          'You do not have access to this resource',
        );
      }
    }
    if (req.user.role === 'admin') {
      return this.doctorService.getDoctor(id);
    }
  }

  @Roles('doctor')
  @ApiOperation({ summary: 'Update doctor (Doctor Only allowed)' })
  @Patch('/')
  async updateDoctor(@Body() doctorDetails: Doctor, @Request() req) {
    const {
      user: { userId },
    } = req;

    return this.doctorService.updateDoctor(userId, doctorDetails);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Delete doctor (Admin Only allowed)' })
  @Delete('/:id')
  async deleteDoctor(@Param('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }

  @Roles('patient', 'admin')
  @ApiOperation({ summary: 'Book Appointment (Patient and Admin allowed)' })
  @Post('/:id/appointment')
  async bookAppointment(
    @Param('id') id: string,
    @Body() appointmentDetails: Appointments,
  ) {
    return this.doctorService.bookAppointment(id, appointmentDetails);
  }

  @UseGuards(RolesGuard)
  @Roles('doctor')
  @ApiOperation({ summary: 'Get all appointments (Doctor only allowed)' })
  @Get('/appointments')
  async getAllAppointments(@Request() req) {
    const {
      user: { userId },
    } = req;

    return this.doctorService.getAllAppointments(userId);
  }

  @Roles('doctor')
  @ApiOperation({ summary: 'Add Prescription (Doctor only allowed)' })
  @Post('/appointments/:id')
  async addPrescription(@Param('id') id: string, @Body() prescription: string) {
    return this.doctorService.addPrescription(id, prescription);
  }
}
