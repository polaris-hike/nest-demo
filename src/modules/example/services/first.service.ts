import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstService {
    useValue() {
        return '11';
    }

    useId() {
        return '字符串提供者';
    }

    useAlias() {
        return '别名提供者';
    }
}
