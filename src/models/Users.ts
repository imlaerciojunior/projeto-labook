export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: USER_ROLES;
  createdAt: string;
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,
    private createdAt: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(newValue: string): void {
    this.id = newValue;
  }

  public getName(): string {
    return this.name;
  }

  public setName(newValue: string): void {
    this.name = newValue;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(newValue: string): void {
    this.email = newValue;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(newValue: string): void {
    this.password = newValue;
  }

  public getRole(): USER_ROLES {
    return this.role;
  }

  public setRole(value: USER_ROLES): void {
    this.role = value;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setCreatedAt(newValue: string): void {
    this.createdAt = newValue;
  }

  public toDBModel(): UserDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.createdAt,
    };
  }

  public toBusinessModel(): UserModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
