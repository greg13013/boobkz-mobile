/*
 Ordre des symboles pour un rouleau
*/
import {Symboles} from './symboles';
import {Roll} from './rolls';

export class SymboleOrder {
  constructor(
    public id?: number,
    public order?: number, /* compris entre min(Roll.stopPhysical) et max(Roll.stopPhysical*/
    public symbole?: Symboles,
    public roll?: Roll
  ) {
  }
}
