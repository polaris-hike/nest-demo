import bcrypt from 'bcrypt';
import { get, isNil, toNumber } from 'lodash';

import { Configure } from '../config/configure';

import { ConfigureFactory, ConfigureRegister } from '../config/types';

import { UserConfig } from './types';

export const defaultUserConfig = (configure: Configure): UserConfig => {
    return {
        hash: 10,
        jwt: {
            secret: configure.env.get('USER_TOKEN_SECRET', 'my-refresh-secret'),
            token_expired: configure.env.get('USER_TOKEN_EXPIRED', (v) => toNumber(v), 3600),
            refresh_secret: configure.env.get('USER_REFRESH_TOKEN_SECRET', 'my-refresh-secret'),
            refresh_token_expired: configure.env.get(
                'USER_REFRESH_TOKEN_EXPIRED',
                (v) => toNumber(v),
                3600 * 30,
            ),
        },
    };
};

export const encrypt = async (configure: Configure, password: string) => {
    const hash = (await getUserConfig<number>(configure, 'hash')) || 10;
    try {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/return-await
        return await Bun.password.hash(password, {
            algorithm: 'bcrypt',
            cost: hash,
        });
    } catch (error) {
        return bcrypt.hashSync(password, hash);
    }
};

export const decrypt = (password: string, hashed: string) => {
    try {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/return-await
        return Bun.password.verifySync(password, hashed);
    } catch (error) {
        return bcrypt.compareSync(password, hashed);
    }
};

/**
 * 用户配置创建函数
 * @param register
 */
export const createUserConfig: (
    register: ConfigureRegister<RePartial<UserConfig>>,
) => ConfigureFactory<UserConfig> = (register) => ({
    register,
    defaultRegister: defaultUserConfig,
});

/**
 * 获取user模块配置的值
 * @param configure
 * @param key
 */
export async function getUserConfig<T>(configure: Configure, key?: string): Promise<T> {
    const userConfig = await configure.get<UserConfig>('user', defaultUserConfig(configure));
    if (isNil(key)) return userConfig as T;
    return get(userConfig, key) as T;
}
