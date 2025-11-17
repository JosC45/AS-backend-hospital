import { Test, TestingModule } from "@nestjs/testing";
import { UsuarioService } from "./usuario.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ROLES_USUARIO, ESTADO_USUARIO, Usuario } from "./entities/usuario.entity";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

jest.mock('bcrypt');

const mockRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe("UsuarioService", () => {
  let service: UsuarioService;
  let repo: jest.Mocked<Repository<Usuario>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repo = module.get(getRepositoryToken(Usuario));
  });

  // 🔹 TEST create()
  it("should create a user (create method)", async () => {

    const user_personal={
      id:1,
      username: "Pedro",
      password: "Alianza_Lima",
      rol: ROLES_USUARIO.PERSONAL,
      estado:ESTADO_USUARIO.ACTIVO
    }

    repo.create.mockReturnValue(user_personal);

    repo.save.mockResolvedValue(user_personal);

    const result = await service.create(user_personal);

    expect(repo.create).toHaveBeenCalledWith(user_personal);

    expect(repo.save).toHaveBeenCalled();

    expect(result).toBe(`Se creo el usuario con el rol ${ROLES_USUARIO.PERSONAL}`);
  });

  it("should create a user (create method) with ADMIN", async () => {

    const user_admin={
      id:1,
      username: "Alejandro",
      password: "Cumpañere",
      rol: ROLES_USUARIO.ADMIN,
      estado:ESTADO_USUARIO.ACTIVO
    }

    repo.create.mockReturnValue(user_admin);

    repo.save.mockResolvedValue(user_admin);

    const result = await service.create(user_admin);

    expect(repo.create).toHaveBeenCalledWith(user_admin);

    expect(repo.save).toHaveBeenCalled();

    expect(result).toBe(`Se creo el usuario con el rol ${ROLES_USUARIO.ADMIN}`);
  });

  // 🔹 TEST createUserByRol()
  const mockDto = { username: "test", password: "123456", rol: ROLES_USUARIO.ADMIN };

  it("should throw ConflictException if user exists", async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, username: "test" } as any);

    await expect(service.createUserByRol(mockDto))
      .rejects
      .toThrow(ConflictException);
  });

  it("should create new user if does not exist", async () => {
    repo.findOneBy.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed123");

    const createdUser = {
      id: 1,
      username: "test",
      password: "hashed123",
      rol: ROLES_USUARIO.ADMIN,
      estado: ESTADO_USUARIO.ACTIVO,
    };

    repo.create.mockReturnValue(createdUser);
    repo.save.mockResolvedValue(createdUser);

    const result = await service.createUserByRol(mockDto);

    expect(repo.findOneBy).toHaveBeenCalledWith({ username: "test" });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();

    expect(result).toEqual(createdUser);
  });

  it("should throw InternalServerErrorException for unexpected errors", async () => {
    repo.findOneBy.mockRejectedValue(new Error("DB error"));

    await expect(service.createUserByRol(mockDto))
      .rejects
      .toThrow(InternalServerErrorException);
  });
});
