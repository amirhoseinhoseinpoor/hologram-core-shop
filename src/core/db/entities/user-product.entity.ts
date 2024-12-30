import { Entity , ManyToOne } from "typeorm";
import { BaseRetailEntity } from "./base-retail.entity";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity('UserProduct')
export class UserProduct extends BaseRetailEntity {
  @ManyToOne(() => User , (user) => user.savedProducts , { nullable: true })
  user: User;

  @ManyToOne(() => Product , (product) => product.savedBy , {nullable : true})
  product : Product
}