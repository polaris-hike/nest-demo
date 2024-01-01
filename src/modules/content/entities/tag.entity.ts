import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, ManyToMany, PrimaryColumn, Relation } from 'typeorm';

import { PostEntity } from './post.entity';

@Exclude()
@Entity('content_tags')
export class TagEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string;

    @Expose()
    @Column({ comment: '标签名称' })
    @Index({ fulltext: true })
    name: string;

    @Expose()
    @Column({ comment: '标签描述', nullable: true })
    description?: string;

    @Expose()
    @ManyToMany(() => PostEntity, (post) => post.tags)
    posts: Relation<PostEntity[]>;

    /**
     * 通过queryBuilder生成的文章数量(虚拟字段)
     */
    @Expose()
    postCount: number;
}
