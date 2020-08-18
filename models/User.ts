import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class AuthUser {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    displayname: string = "";
    @Column()
    username: string = "";
    @Column()
    password: string = "";
}

