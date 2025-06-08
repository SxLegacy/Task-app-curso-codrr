import { Column, Entity, OneToMany } from "typeorm";
import { IUser } from "../interfaces/user.interface";
import { ROLES } from "../../constants/roles";
import { BaseEntity } from "../../config/base.entity";
import { UsersProjectsEntity } from "./usersProjects.entity";
import { Exclude } from "class-transformer";

@Entity({name: 'users'})
export class UsersEntity extends BaseEntity implements IUser{
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: ROLES})
    role: ROLES;

    @OneToMany(()=> UsersProjectsEntity, (userProjects) => userProjects.user,)
    projectsIncludes: UsersProjectsEntity[]
}