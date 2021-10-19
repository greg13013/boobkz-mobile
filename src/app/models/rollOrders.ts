import {Roll} from './rolls';
import {Slot} from './Slot';

export class RollOrders {

  constructor(public id?: number,
              public order?: number,
              public position?: number,
              public slot?: Slot,
              public roll?: Roll

  ) {  }
}
