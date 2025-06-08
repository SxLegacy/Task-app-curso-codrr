import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBadRequestResponse, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccess } from 'src/auth/decorators/admin.decorators';
import { AccessLevel } from 'src/auth/decorators/access-level.decorators';
import { ProjectsEntity } from 'src/projects/entities/projects.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Get('say-hello')
  getHello(): string {
    return this.usersService.getHello();
  }

  @PublicAccess()
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Registrar un usuario.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El usuario ha sido registrado exitosamente.'
  })
  @ApiBadRequestResponse({
    description: 'No se registró el usuario.'
  })
  @Post('register')
  public async registerUser(@Body() body: UserDTO) {
    return await this.usersService.createUser(body);
  }
  
  @AccessLevel(40)
  @ApiParam({name: 'projectId'})
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Relacionar un usuario a un proyecto especifico.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El usuario ha sido registrado exitosamente.'
  })
  @ApiBadRequestResponse({
    description: 'Error no se registró el usuario.'
  })  
  @Post('add-to-project')
  public async addToProject(
    @Body() body: UserToProjectDTO,
    @Param('projectId', new ParseUUIDPipe()) id:string,
  ) {
    return await this.usersService.relationToProject({
      ...body,
      project: id as unknown as ProjectsEntity,
    });
  }

  @Roles('ADMIN') // se puede usar @AdminAccess
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Buscar todos los usuarios.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuarios Encontrados.'
  })
  @ApiBadRequestResponse({
    description: 'No se han registrado usuarios aun.'
  })
  @Get('all')
  public async findAllUsers() {
    return await this.usersService.findUsers();
  }

  @PublicAccess()
  @ApiParam({name: 'id'})
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Buscar usuario especifico.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El usuario ha sido añadido al proyecto exitosamente.'
  })
  @ApiBadRequestResponse({
    description: 'No se encontro resultado'
  })
  @Get(':id')
  public async findUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findUserById(id);
  }

  @AccessLevel(40)
  @ApiParam({name: 'id'})
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Editar usuario especifico.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El usuario ha sido editado exitosamente.'
  })
  @ApiBadRequestResponse({
    description: 'No se pudo editar'
  })
  @Put('edit/:id')
  public async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UserUpdateDTO) {
    return await this.usersService.updateUser(body,id);
  }

  @AdminAccess()
  @ApiParam({name: 'id'})
  @ApiHeader({
    name: 'codrr_token'
  })
  @ApiOperation({ summary: '=> Eliminar usuario especifico.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El usuario ha sido eliminado exitosamente.'
  })
  @ApiBadRequestResponse({
    description: 'No se pudo editar'
  })
  @Delete('delete/:id')
  public async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteUser(id);
  } 
}
