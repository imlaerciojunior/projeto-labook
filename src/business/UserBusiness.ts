import { UserDatabase } from "../database/UserDatabase";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../dtos/UserDTO/createUser.dto";
import { DeleteUserInputDTO, DeleteUserOutputDTO } from "../dtos/UserDTO/deleteUser.dto";
import { EditUserInputDTO, EditUserOutputDTO } from "../dtos/UserDTO/editUser.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/Users";
import { UserDB } from "../types";

export class UserBusiness {
  constructor(private userDatabase: UserDatabase) {}

  public getUsers = async (input: any) => {
    const { q } = input;
    const usersDB = await this.userDatabase.findUsers(q);

    const users: User[] = usersDB.map(
      (usersDB) =>
        new User(
          usersDB.id,
          usersDB.name,
          usersDB.email,
          usersDB.password,
          usersDB.role,
          usersDB.created_at
        )
    );
    return users;
  };

  public createUsers = async (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
    const { id, name, email, password, role } = input;

    const userDBExists = await this.userDatabase.findUserById(id);

    if (userDBExists) {
      throw new BadRequestError("'id' já existe");
    }

    const user = new User(
      id,
      name,
      email,
      password,
      role,
      new Date().toISOString()
    );

    const newUserDB: UserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt(),
    };

    await this.userDatabase.insertUser(newUserDB);

    const output: CreateUserOutputDTO = {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
      },
    };

    return output;
  };

  public updateUsers = async (input: EditUserInputDTO): Promise<EditUserOutputDTO> => {
    const { idToEdit, id, name, email, password, role } = input;

    const userDBExists = await this.userDatabase.findUserById(idToEdit);

    if (!userDBExists) {
      throw new NotFoundError("'id' não encontrado");
    }

    const user = new User(
      userDBExists.id,
      userDBExists.name,
      userDBExists.email,
      userDBExists.password,
      userDBExists.role,
      userDBExists.created_at
    );

    id && user.setId(id);
    name && user.setName(name);
    email && user.setEmail(email);
    password && user.setPassword(password);
    role && user.setRole(role);

    const updatedUser: UserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt(),
    };

    await this.userDatabase.updateUser(updatedUser);

    const output: EditUserOutputDTO = {
      message: "User editado  com sucesso",
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
      },
    };

    return output;
  };

  public deleteUsers = async (input: DeleteUserInputDTO ): Promise<DeleteUserOutputDTO> => {
    const { idToDelete } = input;

    const userDBExists = await this.userDatabase.findUserById(idToDelete);

    if (!userDBExists) {
      throw new NotFoundError("Não foi possível encontrar o usuário");
    }

    await this.userDatabase.deleteUser(idToDelete);

    const output: DeleteUserOutputDTO = {
      message: "usuário deletado com sucesso",
      user: {
        id: idToDelete,
      },
    };

    return output;
  };
}