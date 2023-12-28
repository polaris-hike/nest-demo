import { Injectable } from '@nestjs/common';

// @Injectable({ scope: Scope.TRANSIENT })
@Injectable()
export class SeventhService {
    protected demo = 0;

    async add() {
        this.demo++;
    }

    async find() {
        return this.demo;
    }
}
