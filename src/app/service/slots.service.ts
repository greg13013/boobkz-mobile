import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Slot} from '../models/Slot';

@Injectable({
  providedIn: 'root'
})
export class SlotsService {

  slots: Slot[] = new Array<Slot>();
  slot!: Slot;

  baseUrl = 'https://boobkz.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  getAllSlot(){

    return new Promise((resolve, reject) => {
      this.httpClient.get(this.baseUrl+'/api/slots')
        .subscribe(
          (response: any) => {

            this.slots = response;

            resolve(response);

          },
          (error) => {

            reject(error);
          }
        );
    });
  }

  getSlotByIdWithPayoutTable(idSlot: number){
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.baseUrl+'/api/slots/'+ idSlot +'/payout-table/combinaisons/combinaison-images')
        .subscribe(
          (response: any) => {
            // console.log('response getAllRolls : ',response);
            // this.symboleOrders = response;

            // console.log('symboles service : ', this.symboles);
            // this.slot = response;
            resolve(response);
          },
          (error) => {
            // console.log('error getAllRolls : ', error)
            reject(error);
          }
        );
    });


  }

  getSlotByIdWithRollOrders(idSlot: number){
    return new Promise<Slot>((resolve, reject) => {
      this.httpClient.get(this.baseUrl+'/api/slots/'+ idSlot +'/roll-orders/roll/symbole-orders')
        .subscribe(
          (response: any) => {
            // console.log('response getAllRolls : ',response);
            // this.symboleOrders = response;

            // console.log('symboles service : ', this.symboles);
            // this.slot = response;
            resolve(response);
          },
          (error) => {
            // console.log('error getAllRolls : ', error)
            reject(error);
          }
        );
    });


  }


  playSlot(idSlot: number){
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.baseUrl+'/api/slots/'+ idSlot +'/play')
        .subscribe(
          (response: any) => {
            this.slot = response;
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}
