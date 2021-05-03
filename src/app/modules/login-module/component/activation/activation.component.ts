import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { SpinnerShowService } from 'src/app/component/spinner';
import { AuthenticateService } from '../../service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {
  private subscription: Subscription;

  tokenActivation: string = null;
  errorMessage: string = null;
  userName: string = null;
  constructor(
    private router: Router,
    private spinnerService:SpinnerShowService,
    private service:AuthenticateService,
    private activatedRoute: ActivatedRoute){
    this.activatedRoute.queryParams.subscribe(params => {
      this.tokenActivation = params['param'];
  });
 }

 closeWindow(){
    window.close();
 }


  ngOnInit(): void {
    if (!this.tokenActivation) {
      this.router.navigateByUrl('/login/authenticate');
    }    
    this.service.activate(this.tokenActivation).subscribe(
      data => {
          this.userName = data.data.name;
          this.errorMessage = "Ativação realizada com sucesso.";
          this.spinnerService.hideSpinner();
          this.subscription = interval(10000)
          .subscribe(x => { this.closeWindow(); });
         
      },
      err => {
        if (err.error && err.error.errors){
          this.errorMessage = err.error.errors.message  + " => ";
          let array = err.error.errors.errors;
          for (let i = 0; i < array.length; i++) {
            this.errorMessage =  this.errorMessage + array[i] + "  "; 
          }
        }else{
          if ( err.message.includes("Http failure response for")){
            this.errorMessage = "Http service unavailable";
          }else{
            this.errorMessage = err.message;
          }
          
        }
        this.errorMessage = "Ocorreu um erro, tente novamente mais tarde. Caso o erro perista, por favor entre em contato. Detalhe do erro: " + this.errorMessage;
        this.spinnerService.hideSpinner();
      }
      

    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
 }

}
