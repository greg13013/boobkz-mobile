/*
 Rouleau contient une liste de symboles et un nombre de cran
*/
import {SymboleOrder} from './symbolesOrder';
export class Roll {
  constructor(
    public id?: number,
    public name?: string,
    public stopPhysical?: number, /* 22 crans physiques */
    public symboleOrders?: SymboleOrder[] /* un rouleau a un ou plusieurs symboles ordonnée */
  ) {
  }
}
