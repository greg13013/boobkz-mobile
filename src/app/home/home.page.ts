import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Slot} from '../models/Slot';
import {Play} from '../models/play';
import {SlotsService} from '../service/slots.service';
import {Subscription, timer} from 'rxjs';
import {Combinaisons} from '../models/combinaisons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  loader: boolean = false;
  loaderPlay: boolean = false;

  tabPayoutTable!: Combinaisons[];
  tabPayoutTable2!: Combinaisons[];

  form: FormGroup;

  // vitesseParam: number = 1;
  tempInterval: number = 2;
  tempAttente: number = 0;

  heightBloc: number = 150;
  nbreSymbole: number | undefined;
  nbrePartie: number = 0;
  stopSymbole: any[] = [];


  subscriptionTimer!: Subscription;
  subscriptionAuto!: Subscription;
  jouer:boolean = false;
  idInterval: any;
  // auto: boolean = false;

  tabResultat: any[] =[];
  historiqueResultat: Play[] = [];
  tabAnimation: any[] = ['bounce','rotateIn','jello','wobble','tada','rubberBand','pulse','flash'];
  tabRemoveAnimation: any[] = ['bounce','rotateIn','jello','wobble','tada','rubberBand','pulse','flash', 'headShake', 'shake'];

  slot!: Slot;
  resultat!: Play;



  constructor(private slotService: SlotsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      slotID: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.getAllSlots();
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


  animationVraiRoulette(auto?: boolean){

    let tabSymboleOrder: Play = new Play([],0);
    let stop : any[] = [];
    this.tabResultat = [];
    this.tempAttente = 0;
    let bloc = 0;


    let loaderAnimation = true;
    this.loaderPlay = true;

    // if (auto) {
    //   this.tempAttente = 2000;
    // } else {
    //   this.tempAttente = 0;
    // }

    this.nbrePartie++;

    this.nbreSymbole = this.slot.rollOrders[0].roll!.stopPhysical;


    //historique
    this.historiqueResultat.push(this.resultat);

    console.log('historique resultat : ', this.historiqueResultat);
    console.log('debut idInterval : ', this.idInterval);


    //tabposition => slot.rollOrders
    //tabSymboleOrder => resultat tirage


    tabSymboleOrder = this.resultat;


    console.log(tabSymboleOrder);
    tabSymboleOrder.symboleOrders!.forEach((symboleOrder) => {
      let i = this.heightBloc*symboleOrder.order! - this.heightBloc*2;
      if (i < 0){
        i = this.heightBloc * this.slot.rollOrders[0].roll!.symboleOrders!.length - this.heightBloc;
      }
      stop.push({position: i, symbole: symboleOrder.symbole?.name, vitesse : 1});
    })


    this.stopSymbole.push(stop);

    this.slot.rollOrders.forEach((roll, indexRoll) => {
      roll.roll?.symboleOrders?.forEach((symbole) => {

        this.tabRemoveAnimation.forEach((animation) => {
          document.getElementById('1roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animated', animation);
          document.getElementById('0roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animated', animation);
        });
      });
    });




    // vitesse = this.vitesseParam;
    //
    // console.log('vitesse : ', vitesse)
    console.log('tempInterval : ',this.tempInterval);
    console.log('stop : ', stop);

    console.log('temp Attente : ', this.tempAttente);



    // stop -= this.heightBloc

    // this.topPosition = stop - 96;


    this.subscriptionTimer = timer(this.tempAttente,this.tempInterval).subscribe( x => {






      this.slot.rollOrders.forEach((roll, index) => {

        //enleve décimale
        roll.position = Math.round(roll.position!);

        if(roll.position! >= this.heightBloc*this.nbreSymbole! || roll.position! < 0) {
          roll.position = 0;
        }
        // roll.position = roll.position + this.vitesseParam;
        // console.log(roll)


        //TEST VITESSE

        //de plus en plus vite
        if (stop[index].vitesse <= 15 && loaderAnimation) {
          stop[index].vitesse = stop[index].vitesse + 0.05;
        }

        //ralentissement apres quand le loader fini
        if (!loaderAnimation && stop[index].vitesse > 2) {
          stop[index].vitesse = stop[index].vitesse - 0.02;
        }

        //avoir un chiffre rond sinon boucle infinie
        if (!loaderAnimation && stop[index].vitesse < 1) {
          stop[index].vitesse = 1;
        }

        //ralentir a 70% de l'arrivé;
        if (!loaderAnimation && roll.position! > (stop[index].position*0.70) && roll.position! < stop[index].position && stop[index].vitesse < 2){
          stop[index].vitesse = 1;
        }


        // console.log(stop[index].vitesse)

        if (loaderAnimation){
          roll.position = roll.position! + stop[index].vitesse;
        }
        else {
          // console.log('stop : ' , stop[index])

          // console.log('roll position :',Math.round(roll.position));
          // console.log('stop position :',stop[index].position);
          //ralentis l'animation apres avoir reçu les symbole gagnant
          if (roll.position !== stop[index].position || stop[index].vitesse > 2){
            roll.position = roll.position! + stop[index].vitesse;
          }

          if (roll.position === stop[index].position ) {

            //je remplis un tableau, je cherche si il existe deja, je l'ajoute s'il n'existe pas
            if (!this.tabResultat.find(element => element.id === roll.id)) {

              this.tabResultat.push(roll);
              bloc++;
            }


            //si tous les rouleaux ont fini de tourner, clearInterval
            if (this.tabResultat.length === stop.length && bloc === this.tabResultat.length)
            {
              bloc = 0;
              console.log(this.tabResultat.length);
              console.log(stop.length);
              console.log('clear');
              this.subscriptionTimer.unsubscribe();

              //animation chiffre
              this.resultat.symboleOrders?.forEach((symbole, index) => {


                if (this.resultat.gain === 0){

                  document.getElementById('cadreMachine')!.classList.add('animationFlashRouge');

                  if (symbole.order === 1){
                    // document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animated', 'shake');

                  }
                  else {
                    // document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animated', 'shake');
                  }
                }

                if (this.resultat.gain! === 1) {
                  // document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                  document.getElementById('cadreMachine')!.classList.add('animationFlashJaune');
                }
                if (this.resultat.gain! === 12345) {
                  // document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                  document.getElementById('cadreMachine')!.classList.add('animationFlashVert');
                }


                if (this.resultat.gain! > 0){

                  let choixAnimationAleatoire = this.tabAnimation[this.getRandomInt(this.tabAnimation.length)];


                  if (symbole.order === 1){
                    // document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('1roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animated', choixAnimationAleatoire);

                  }
                  else {
                    // document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animationWin');
                    document.getElementById('0roll'+index+'Symbole'+symbole.order!.toString())!.classList.add('animated', choixAnimationAleatoire);
                  }
                }

              });

              this.loaderPlay = false;

              if (auto) {

                this.partieAuto();
                // this.animationVraiRoulette(this.auto);

              }
              return;
            }

          }

        }

      });


      timer(3000).subscribe(() => {
        // console.log('fin loaderAnimation');
        loaderAnimation = false;

      });


      // console.log(this.idInterval)


    });

    this.jouer = false;

  }

  partieAuto(){
    this.loaderPlay = true;
    this.subscriptionAuto = timer(2000).subscribe(() => {
      this.play(this.slot.id!, true);
    });

  }

  stopPartie(){
    this.subscriptionTimer.unsubscribe();

    if (this.subscriptionAuto){
      this.subscriptionAuto.unsubscribe();
    }

    this.tabResultat = [];
    this.slot.rollOrders.forEach((roll, indexRoll) => {
      roll.position = 0;

      roll.roll?.symboleOrders?.forEach((symbole) => {

        this.tabRemoveAnimation.forEach((animation) => {
          document.getElementById('1roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animated', animation)
          document.getElementById('0roll'+indexRoll+'Symbole'+symbole.order!.toString())!.classList.remove('animated', animation)
        });
      });
    });

    this.loaderPlay = false;
  }

  play(idSlot: number, auto: boolean){
    document.getElementById('cadreMachine')!.classList.remove('animationFlashVert');
    document.getElementById('cadreMachine')!.classList.remove('animationFlashRouge');
    document.getElementById('cadreMachine')!.classList.remove('animationFlashJaune');
    this.loaderPlay = true;
    this.tabResultat = [];
    this.slotService.playSlot(idSlot).then(
      (response: any)=> {
        this.loaderPlay = false;
        this.resultat = response;

        // let a = new SymboleOrder(1,1,{id:1,name: '8R'})
        // let b = new SymboleOrder(2,2,{id:2,name: '2W'})
        // let c = new SymboleOrder(3,3,{id:3,name: '7V'})
        // this.resultat.symboleOrders?.push(a,b,c);
        this.animationVraiRoulette(auto);
        console.log('response playSlot : ', response)
      }
    ).catch(
      (error) => {
        this.loaderPlay = false;
        console.log('erreur playSlot : ', error)
      }
    )
  }

  getAllSlots(){
    this.loader = true;
    this.slotService.getAllSlot().then(
      (response)=> {
        this.loader = false;
        console.log('response getAllSlots : ', response)
      }
    ).catch(
      (error) => {
        this.loader = false;
        console.log('erreur getAllSlots : ', error)
      }
    )
  }

  getSlot(idSlot: number){
    this.loader = true;
    this.historiqueResultat = [];
    this.slotService.getSlotByIdWithPayoutTable(idSlot).then(
      (response: any) => {
        this.slot = response;
        console.log('getSlotByIdWithPayoutTable : ', response);


        let totalPayoutTable = this.slot.payoutTable?.combinaisons?.length;

        this.tabPayoutTable = this.slot.payoutTable?.combinaisons?.slice(0,totalPayoutTable!/2)!;
        this.tabPayoutTable2 = this.slot.payoutTable?.combinaisons?.slice(totalPayoutTable!/2+1, totalPayoutTable)!;


        console.log(this.tabPayoutTable);
        this.slotService.getSlotByIdWithRollOrders(idSlot).then(
          (responseOrder: Slot) => {


            //tri par order les symbole du rouleau
            responseOrder.rollOrders.forEach((roll) => {
              roll.position = 0;
              roll.roll?.symboleOrders?.sort((a,b) => a.order! - b.order!);
            });

            this.loader = false;
            this.slot.rollOrders = responseOrder.rollOrders;
            console.log('getSlotByIdWithRollOrders : ', responseOrder);
            console.log('slot : ', this.slot);
          }
        ).catch(
          (error) => {
            this.loader = false;
            console.log('Erreur getSlotByIdWithRollOrders : ', error)
          }
        );

      }
    ).catch(
      (error) => {
        this.loader = false;
        console.log('Erreur getSlotByIdWithPayoutTable : ', error)
      }
    );
  }

  submit(){

    if (this.form.valid){

      this.getSlot(this.form.value['slotID']);

    } else {
      console.log('Error form invalid');
    }

  }
}
