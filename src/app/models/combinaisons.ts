import {PayoutTable} from './payoutTable';
import {SymboleOrderCombinaisons} from './symboleOrderCombinaisons';

export class Combinaisons {

  constructor(public id?: number,
              public gain?: number,
              public payoutTable?: PayoutTable,
              public symboleOrderCombinaisons?: SymboleOrderCombinaisons[]

  ) {  }
}
