import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteWithTrashDto } from '@/modules/restful/dtos/delete-with-trash.dto';

import { RestoreDto } from '@/modules/restful/dtos/restore.dto';

import { Guest } from '../decorators/guest.decorator';
import { UserService } from '../services';

// src/modules/user/controllers/user.controller.ts
@ApiTags('用户管理')
// @Depends(UserModule)
@Controller('users')
export class UserController {
    constructor(protected service: UserService) {}

    /**
     * 用户列表
     */
    @Get()
    @Guest()
    @SerializeOptions({ groups: ['user-list'] })
    async list() {
        return this.service.list();
    }

    /**
     * 获取用户信息
     * @param id
     */
    @Get(':id')
    @Guest()
    @SerializeOptions({ groups: ['user-detail'] })
    @ApiBearerAuth()
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    /**
     * 批量删除用户
     * @param data
     */
    @Delete()
    @SerializeOptions({ groups: ['user-list'] })
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data;
        return this.service.delete(ids, trash);
    }

    /**
     * 批量恢复用户
     * @param data
     */
    @Patch('restore')
    @SerializeOptions({ groups: ['user-list'] })
    async restore(
        @Body()
        data: RestoreDto,
    ) {
        const { ids } = data;
        return this.service.restore(ids);
    }
}
