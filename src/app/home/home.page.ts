import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Slot} from '../models/Slot';
import {Play} from '../models/play';
import {SlotsService} from '../service/slots.service';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  loader: boolean = false;
  loaderPlay: boolean = false;

  form: FormGroup;


  topPosition: number = 0;
  topPosition2: number = 0;
  topPosition3: number = 0;

  vitesseParam: number = 1;
  tempInterval: number = 1;
  tempAttente: number = 0;

  heightBloc: number = 96;
  nbreSymbole: number | undefined;
  nbrePartie: number = 0;
  stopSymbole: any[] = [];


  subscriptionTimer!: Subscription;
  jouer:boolean = false;
  idInterval: any;
  auto: boolean = false;

  tabResultat: any[] =[]

  slot!: Slot;
  resultat!: Play;



  constructor(private slotService: SlotsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      slotID: ['', Validators.required],
    });
    this.getAllSlots();
  }



  animationVraiRoulette(auto?: boolean){

    let tabSymboleOrder: Play = new Play([],0);
    let stop : any[] = [];
    this.tabResultat = [];
    let vitesse = this.vitesseParam;
    this.tempAttente = 0;


    let loaderAnimation = true;
    this.loaderPlay = true;

    if (auto) {
      this.tempAttente = 2000;
      this.auto = true;
    }

    this.nbreSymbole = this.slot.rollOrders[0].roll!.stopPhysical;


    console.log('debut idInterval : ', this.idInterval);


    //tabposition => slot.rollOrders
    //tabSymboleOrder => resultat tirage

    // if (!this.resultat){
    //   this.slot.rollOrders.forEach((roll) => {
    //
    //     let chiffreAlea = this.getRandomNumber(1,5);
    //     let a = new SymboleOrder(1,chiffreAlea,{id:1,name: this.getSymboleRouleau(roll.roll!, chiffreAlea)?.symbole?.name})
    //     tabSymboleOrder.symboleOrders!.push(a);
    //   })
    // }
    tabSymboleOrder = this.resultat;


    console.log(tabSymboleOrder);
    tabSymboleOrder.symboleOrders!.forEach((symboleOrder) => {
      let i = 96*symboleOrder.order! - 96*2;
      if (i < 0){
        i = this.heightBloc * this.slot.rollOrders[0].roll!.symboleOrders!.length - 96;
      }
      stop.push({position: i, symbole: symboleOrder.symbole?.name});
    })


    this.stopSymbole.push(stop);

    this.slot.rollOrders.forEach((roll, indexRoll) => {
      roll.roll?.symboleOrders?.forEach((symbole) => {
        document.getElementById('1roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animationWin');
        document.getElementById('0roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animationWin');
      });
    });




    vitesse = this.vitesseParam;

    console.log('vitesse : ', vitesse);
    console.log('tempInterval : ',this.tempInterval);
    console.log('stop : ', stop);





    // stop -= this.heightBloc

    // this.topPosition = stop - 96;
    console.log('topPosition : ',this.topPosition);


    this.subscriptionTimer = timer(this.tempAttente,this.tempInterval).subscribe( x => {


      //TEST VITESSE

      //de plus en plus vite
      if (vitesse <= 10 && loaderAnimation) {
        vitesse = vitesse + 0.05;
      }

      //ralentissement apres quand le loader fini
      if (!loaderAnimation && vitesse > 0.5) {
        vitesse = vitesse - 0.01;
      }

      //avoir un chiffre rond sinon boucle infinie
      if (!loaderAnimation && vitesse < 0.5) {
        vitesse = 0.5;
      }

      this.slot.rollOrders.forEach((roll, index) => {
        if(roll.position! >= this.heightBloc*this.nbreSymbole! || roll.position! < 0) {
          roll.position = 0;
        }
        // roll.position = roll.position + this.vitesseParam;
        // console.log(roll)



        if (loaderAnimation){
          roll.position = roll.position! + vitesse;
        }
        else {
          // console.log('stop : ' , stop[index])


          //ralentis l'animation apres avoir reçu les symbole gagnant
          if (roll.position !== stop[index].position || vitesse > 2){
            roll.position = roll.position! + vitesse;
          }

          if (roll.position === stop[index].position ) {

            //je remplis un tableau, je cherche si il existe deja, je l'ajoute s'il n'existe pas
            if (this.tabResultat.find(element => element.id === roll.id)) {
              console.log('trouvé');
              // this.tabResultat.splice(index,1)
            } else {
              this.tabResultat.push(roll);
            }
            // console.log(this.tabResultat)
            // console.log(this.testSymboleObject)

            //si tous les rouleaux ont fini de tourner, clearInterval
            if (this.tabResultat.length === stop.length)
            {
              console.log('clear');
              this.subscriptionTimer.unsubscribe();
              // clearTimeout(idTimeOut);



              //animation chiffre gagnant rotation 360
              this.resultat.symboleOrders?.forEach((symbole, index) => {
                // console.log('symbole.order : ', symbole.order);
                // console.log('id : ', symbole.order! * (96));

                if (this.resultat.gain! > 0){
                  if (symbole.order === 1){
                    // document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.setAttribute('class', 'animationWin');

                  }
                  else {
                    // document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.setAttribute('class', 'animationWin');
                  }
                }


              })



              console.log('fin idInterval : ,',this.idInterval);
              this.loaderPlay = false;
              this.nbrePartie++;

              if (this.auto) {

                this.animationVraiRoulette(true);

              }
            }

          }

        }

      });


      timer(4000).subscribe(() => {
        loaderAnimation = false;
      });


      // console.log(this.idInterval)


    })

    this.jouer = false;

  }

  play(idSlot: number){
    this.loaderPlay = true;
    this.slotService.playSlot(idSlot).then(
      (response: any)=> {
        this.loaderPlay = false;
        this.resultat = response;
        // let a = new SymboleOrder(1,1,{id:1,name: '8R'})
        // let b = new SymboleOrder(2,2,{id:2,name: '2W'})
        // let c = new SymboleOrder(3,3,{id:3,name: '7V'})
        // this.resultat.symboleOrders?.push(a,b,c);
        this.animationVraiRoulette();
        console.log('response playSlot : ', response);
      }
    ).catch(
      (error) => {
        this.loaderPlay = false;
        console.log('erreur playSlot : ', error);
      }
    );
  }

  getAllSlots(){
    this.loader = true;
    this.slotService.getAllSlot().then(
      (response)=> {
        this.loader = false;
        console.log('response getAllSlots : ', response);
      }
    ).catch(
      (error) => {
        this.loader = false;
        console.log('erreur getAllSlots : ', error);
      }
    );
  }

  getSlot(idSlot: number){
    this.loader = true;
    this.slotService.getSlotByIdWithPayoutTable(idSlot).then(
      (response: any) => {
        this.slot = response;
        console.log('getSlotByIdWithPayoutTable : ', response);

        this.slotService.getSlotByIdWithRollOrders(idSlot).then(
          (responseOrder: Slot) => {


            //tri par order les symbole du rouleau
            responseOrder.rollOrders.forEach((roll) => {
              roll.position = 0;
              roll.roll?.symboleOrders?.sort((a,b) => a.order! - b.order!);
            })

            this.loader = false;
            this.slot.rollOrders = responseOrder.rollOrders;
            console.log('getSlotByIdWithRollOrders : ', responseOrder);
            console.log('slot : ', this.slot);
          }
        ).catch(
          (error) => {
            this.loader = false;
            console.log('Erreur getSlotByIdWithRollOrders : ', error);
          }
        );

      }
    ).catch(
      (error) => {
        this.loader = false;
        console.log('Erreur getSlotByIdWithPayoutTable : ', error);
      }
    )
  }

  submit(){

    if (this.form.valid){

      this.getSlot(this.form.value['slotID']);

    } else {
      console.log('Error form invalid');
    }

  }
}
