import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Session extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;


  @Field()
  @Column()
  dodoCode: string;

  @Field({nullable: true})
  @Column({nullable: true})
  note: string;

  @Field()
  @Column()
  latitude: string;

  @Field()
  @Column()
  longitude: string;


  @Field()
  @Column()
  hostId: number;
//   @Field()
//   latlong(@Root() parent: Session):  {
//     return {
//       lat: parent.latitude,
//       long: parent.longitude
//     };
//   }

  @CreateDateColumn()
  @Field()
  createdAt: string;
}
