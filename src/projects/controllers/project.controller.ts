import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/project.service';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorators';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'src/auth/decorators/public.decorator';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class ProjectController {
    constructor(private readonly projectsService: ProjectsService) {}
    
    @Get('say-hello')
    getHello(): string {
        return this.projectsService.getHello();
    }
    
    @ApiParam({name: 'userId'})
    @Roles('CREATOR')
    @Post('create/userOwner/:userId')
    public async registerProject(@Body() body: ProjectDTO, @Param('userId') userId: string,) {
        return await this.projectsService.createProject(body, userId);
    }
    
    
    @Get('all')
    public async findAllProjects() {
        return await this.projectsService.findProjects();
    }
    
    @ApiParam({name: 'projectId'})
    @Get(':projectId')
    public async findProjectById(@Param('projectId', new ParseUUIDPipe()) id: string) {
        return await this.projectsService.findProjectById(id);
    }

    @PublicAccess()
    @Get('list/api')
    public async listApi(){
        return this.projectsService.listApi()
    }
    
    @ApiParam({name: 'projectId'})
    @AccessLevel(40)
    @Put('edit/:projectId')
    public async updateProject(@Param('projectId', new ParseUUIDPipe()) id: string, @Body() body: ProjectUpdateDTO) {
        return await this.projectsService.updateProject(body,id);
    }
    
    @ApiParam({name: 'projectId'})
    @AccessLevel(40)
    @Delete('delete/:projectId')
    public async deleteProject(@Param('projectId', new ParseUUIDPipe()) id: string) {
        return await this.projectsService.deleteProject(id);
    } 
}
