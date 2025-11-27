import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BodyAuthDto} from './dto/body-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() bodyAuthDto: BodyAuthDto) {
    const user=await this.authService.validateUser(bodyAuthDto.username,bodyAuthDto.password)
    return this.authService.login(user);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }
  
  @Patch('password/:id')
  async changePassword(@Param('id') id:string,@Body() body:{new_password:string,repeat_password:string}){

    const {new_password,repeat_password}=body
    if(new_password===repeat_password){
      const response=await this.authService.changePassword(+id,new_password)

      return response
    }else{
      return {message:"No coinciden las contraseñas"}
    }
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
