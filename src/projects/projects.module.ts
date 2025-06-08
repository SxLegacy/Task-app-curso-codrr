import { Module } from '@nestjs/common';
import { ProjectsService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entities/projects.entity';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectsEntity, UsersProjectsEntity]), 
        ProvidersModule,
    ],
    providers: [ProjectsService, UsersService, HttpCustomService],
    controllers: [ProjectController]
})
export class ProjectsModule {}
