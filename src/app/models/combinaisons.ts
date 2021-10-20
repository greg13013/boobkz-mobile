import {PayoutTable} from './payoutTable';
import {SymboleOrderCombinaisons} from './symboleOrderCombinaisons';
import {CombinaisonImage} from './combinaisonImage';

export class Combinaisons {

  constructor(public id?: number,
              public gain?: number,
              public payoutTable?: PayoutTable,
              public symboleOrderCombinaisons?: [SymboleOrderCombinaisons[]],
              public combinaisonImages?: CombinaisonImage[]

  ) {  }
}
