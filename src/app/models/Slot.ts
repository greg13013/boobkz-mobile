import {RollOrders} from './rollOrders';
import {PayoutTable} from './payoutTable';

export class Slot {

  constructor(public id?: number,
              public name?: string,
              public percentage?: number,
              public payoutTable?: PayoutTable,
              public rollOrders?: RollOrders []

  ) {  }
}
