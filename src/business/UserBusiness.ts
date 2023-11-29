import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, CreateUserOutputDTO,} from "../dtos/UserDTO/createUser.dto";
import { DeleteUserInputDTO, DeleteUserOutputDTO,} from "../dtos/UserDTO/deleteUser.dto";
import { EditUserInputDTO, EditUserOutputDTO,} from "../dtos/UserDTO/editUser.dto";
import { GetUsersInputDTO, GetUsersOutputDTO,} from "../dtos/UserDTO/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/UserDTO/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/UserDTO/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES, User } from "../models/Users";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { UserDB } from "../types";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public getUsers = async (
    input: GetUsersInputDTO
  ): Promise<GetUsersOutputDTO> => {
    const { nameToSearch, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("Somente admins podem acessar esse recurso");
    }

    const usersDB = await this.userDatabase.findUsers(nameToSearch);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role as USER_ROLES,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    const response: GetUsersOutputDTO = users;

    return response;
  };

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const userDBExists = await this.userDatabase.findUserById(id);

    if (userDBExists) {
      throw new BadRequestError("'id' já existente");
    }

    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const response: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token,
    };

    return response;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
    }
    // o password hasheado está no banco de dados
    const hashedPassword = userDB.password;

    // o serviço hashManager analisa o password do body (plaintext) e o hash
    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    // validamos o resultado
    if (!isPasswordCorrect) {
      throw new BadRequestError("'email' ou 'password' incorretos");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role as USER_ROLES,
      new Date().toISOString()
    );

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const response: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token,
    };

    return response;
  };

  public createUsers = async (
    input: CreateUserInputDTO
   ): Promise<CreateUserOutputDTO> => {
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
      role as USER_ROLES,
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

  public updateUsers = async (
    input: EditUserInputDTO
   ): Promise<EditUserOutputDTO> => {
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
      userDBExists.role as USER_ROLES,
      userDBExists.created_at
    );

    id && user.setId(id);
    name && user.setName(name);
    email && user.setEmail(email);
    password && user.setPassword(password);
    role && user.setRole(role as USER_ROLES);

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

  public deleteUsers = async (
    input: DeleteUserInputDTO
   ): Promise<DeleteUserOutputDTO> => {
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
