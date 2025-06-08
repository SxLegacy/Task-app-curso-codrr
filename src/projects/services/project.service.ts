import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';
import { HttpCustomService } from 'src/providers/http/http.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectsEntity) private readonly projectRepository: Repository<ProjectsEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userProjectRepository: Repository<UsersProjectsEntity>,
        private readonly usersService: UsersService,
        private readonly httpService: HttpCustomService,
    ) {}
        getHello(): string {
        return 'Hello World Project!';
        }
    public async createProject(body: ProjectDTO, userId: string): Promise<ProjectsEntity> {
        try {
            const user = await this.usersService.findUserById(userId)
            await this.userProjectRepository.save({
                accessLevel: ACCESS_LEVEL.OWNER,
                user: user,
                project: body
            })
            return await this.projectRepository.save(body);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async listApi(){
        return this.httpService.apiFindAll()
    }

    public async findProjects(): Promise<ProjectsEntity[]> {
        try {
            const projects: ProjectsEntity[] = await this.projectRepository.find();
        //return await this.projectRepository.find() se usaba antes del errorManager
            if (projects.length === 0) {
            // Este if existe porque se diseño el ErrorManager
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se encontro resultado',
            });
            }
            return projects; //siempre que se use un if al final requiere un return
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        //throw new Error(error) ; previo al errroManager
        }
    }

    public async findProjectById(id: string): Promise<ProjectsEntity> {
        try {
        //return await this.projectRepository
            const project: ProjectsEntity = await this.projectRepository
            .createQueryBuilder('project')
            .where({ id })
            .leftJoinAndSelect('project.usersIncludes','usersIncludes')
            .leftJoinAndSelect('usersIncludes.user','user')
            .getOne();
            if (!project) {
                throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se encontro resultado',
            });
            }
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async updateProject(
        body: ProjectUpdateDTO,
        id: string,
        ): Promise<UpdateResult | undefined> {
        try {
            const project: UpdateResult = await this.projectRepository.update(
            id,
            body,
            );
            if (project.affected === 0) {
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'No se actualizo',
            });
            }
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteProject(id: string): Promise<DeleteResult | undefined> {
        try {
            const project: DeleteResult = await this.projectRepository.delete(id);
            if (project.affected === 0) {
                throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se Borro',
        });
        }
        return project;
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message);
    }
    }
}
