// /**
//  * packages
//  */
// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     ManyToOne,
//     JoinColumn,
// } from 'typeorm';

// @Entity('sample_table')
// class SampleEntity {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column({ type: 'varchar', unique: true, length: 32 })
//     token!: string;

//     @Column({ type: 'varchar', unique: true, length: 255 })
//     url!: string;

//     @Column({ type: 'datetime', nullable: true })
//     expire!: Date | null;

//     @CreateDateColumn({ type: 'datetime' })
//     created_at!: Date;

//     @UpdateDateColumn({ type: 'datetime' })
//     updated_at!: Date;
// }

// export default WhitelistEntity;
