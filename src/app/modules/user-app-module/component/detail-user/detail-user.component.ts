import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerShowService } from 'src/app/component/spinner';
import { TokenStorageService } from 'src/app/component/';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  appUser: any;
  buttonSelected: string = "Personal Data";
  mapAnswers = new Map();
  age: number;
  signo: string;
  iconSigno: string;
  labelSigno: string;

  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private tokenStorage: TokenStorageService
    ) {}
    
  ngOnInit(): void {
    if (!this.spinnerService.getAppUserObject()){
      this.router.navigateByUrl('/app_users/list');
    }
    this.appUser = this.spinnerService.getAppUserObject()?.row;
    this.initialValues();
    //verificacao de sessao expirada
    this.spinnerService.showSpinner();
    if (this.tokenStorage.getToken()) {
      //todo guardar url atual
    }else{
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.spinnerService.hideSpinner();
  }


  initialValues(){
    this.sortPreferences();
    this.age = this.getAge();
    this.signo = this.getSigno();
    if (this.signo){
      let tempSigno = this.signo.split(" ");
      this.iconSigno = tempSigno[0];
      this.labelSigno = tempSigno[1];
    }
  }

  sortPreferences(){
    if (!this.appUser?.preferences){
      return;
    } 
    let answers  = this.appUser.preferences;
    answers.sort( function( a, b ) {
      return a.questionAnswerCode.questionName < b.questionAnswerCode.questionName ? -1 : a.questionAnswerCode.questionName > b.questionAnswerCode.questionName ? 1 : 0;
    });
    
    answers.forEach(element => {
        if (this.mapAnswers.has(element.questionAnswerCode.questionName)){
          let a = this.mapAnswers.get(element.questionAnswerCode.questionName);
          a.push(element.questionAnswerCode.answer);
          this.mapAnswers.set(element.questionAnswerCode.questionName,a);
        } else {
          this.mapAnswers.set(element.questionAnswerCode.questionName,[element.questionAnswerCode.answer]);
        }
    });
    return this.mapAnswers;

  }

  get getBindedAnswers(){
    return Array.from(this.mapAnswers.keys());
  }

  getAge(){
    if (!this.appUser?.personalData?.birthDate){
          return 0;
    }
    var timeDiff = Math.abs(Date.now() - new Date(this.appUser?.personalData?.birthDate).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    
  }

  backButton(){
    this.router.navigateByUrl('/app_users/list');
  }

  getDate(someDateString){
    var data = new Date(someDateString),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), 
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }

  getSigno(){
    if (!this.appUser?.personalData?.birthDate){
      return "";
    } 

    let signo: string;
    let dia = new Date(this.appUser?.personalData?.birthDate).getDate();
    let mes = new Date(this.appUser?.personalData?.birthDate).getMonth()+1;
    
       if ((dia >=21) && (mes=3) ||  (dia <=19) && (mes=4)) {
          signo = "♈ Áries";
       }else{
          if ((dia >=20) && (mes=4) ||  (dia <=20) && (mes=5)) {
             signo = "♉ Touro";
          }else{
             if ((dia >=21) && (mes=5) ||  (dia <=21) && (mes=6)) {
                signo = "♊ Gêmeos";
             }else{
                if ((dia >=22) && (mes=6) ||  (dia <=22) && (mes=7)) {
                   signo = "♋ Cancer";
                }else{
                   if ((dia >=23) && (mes=7) ||  (dia <=22) && (mes=8)) {
                      signo = "♌ Leão";
                   }else{
                      if ((dia >=23) && (mes=8) ||  (dia <=22) && (mes=9)) {
                         signo = "♍ Virgem";
                      }else{
                         if ((dia >=23) && (mes=9) ||  (dia <=22) && (mes=10)) {
                            signo = "♎ Libra";
                         }else{
                            if ((dia >=23) && (mes=10) ||  (dia <=21) && (mes=11)) {
                               signo = "♏ Escorpião";
                            }else{
                               if ((dia >=22) && (mes=11) ||  (dia <=21) && (mes=12)) {
                                  signo = "♐ Sagitário";
                               }else{
                                  if ((dia >=22) && (mes=12) ||  (dia <=19) && (mes=1)) {
                                     signo = "♑ Capricórnio";
                                  }else{
                                     if ((dia >=20) && (mes=1) ||  (dia <=18) && (mes=2)) {
                                        signo = "♒ Aquário";
                                     }else{
                                        if ((dia >=19) && (mes=2) ||  (dia <=20) && (mes=3)) {
                                           signo = "♓ Peixes";
    
                                        }
                                     }
                                  }
                               }
                            }
                         }
                      }
                   }
                }
             }
          }
       }
       return signo;
  }

  showData(kind:string){

    this.buttonSelected = kind;
    
    if (kind == 'Personal Data'){
      this.spinnerService.showPersonalData();
    } else if (kind == 'Address'){
        this.spinnerService.showAddressData();
    } else if (kind == 'Photos'){
      this.spinnerService.showPhotoData();
    } else if (kind == 'Preferences'){
      this.spinnerService.showPreferencesData();
    }
  }

}
