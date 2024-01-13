import { Entity, JoinColumn, OneToOne, Relation } from 'typeorm';

import { AccessTokenEntity } from './access-token.entity';
import { BaseToken } from './base.token';

@Entity('user_refresh_tokens')
export class RefreshTokenEntity extends BaseToken {
    @OneToOne(() => AccessTokenEntity, (accessToken) => accessToken.refreshToken, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    accessToken: Relation<AccessTokenEntity>;
}
