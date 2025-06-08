import { Column, Entity, OneToMany } from "typeorm";
import { IProject } from "../../users/interfaces/project.interface";
import { BaseEntity } from "../../config/base.entity";
import { UsersProjectsEntity } from "../../users/entities/usersProjects.entity";
import { TasksEntity } from "../../tasks/entities/tasks.entity";

@Entity({name: 'projects'})
export class ProjectsEntity extends BaseEntity implements IProject {
    @Column()
    name: string;
    @Column()
    description: string;

    @OneToMany(()=> UsersProjectsEntity, (userProjects) => userProjects.project,)
    usersIncludes: UsersProjectsEntity[]

    @OneToMany(()=> TasksEntity, (tasks) => tasks.project,)
    tasks: TasksEntity[]
}