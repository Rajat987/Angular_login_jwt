import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import *  as forge from 'node-forge';
import { LocalStorageServiceService } from '../service/local-storage-service.service';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  publicKey: string = 'helloapp';
  responseToken: string | undefined;
  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private localStorage: LocalStorageServiceService,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  onFormSubmit(): void {

    console.log("from values--" + JSON.stringify(this.loginForm.value));
    const loginData = {
      userName: this.loginForm.get('userName').value,
      password: this.passwordEnryption(this.loginForm.get('password').value)
    }
    this.loginService.getUserAuthenticated(loginData).subscribe((response) => {
      if(response){
        this.responseToken = response.jwt;
        this.localStorage.setItem("token",response.jwt);
        this.router.navigate(['/dashboard']);
      }
      
    }, (error) => {

    })
  }

  passwordEnryption(value: any): any {
    var rsa = forge.pki.publicKeyFromPem(this.publicKey);
    var encryptPass = window.btoa(rsa.encrypt(value));
    return encryptPass;
  }

}
