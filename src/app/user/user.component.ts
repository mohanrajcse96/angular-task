import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr'

interface ResultTable {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: listUsers[];
}
 
interface listUsers {
  id: number;
  first_name: string;
  last_name: number;
  email: string;
  phone_number: string;
  password: string;
  city: string;
  state: string;
  country: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

/**
 * User component
 */
export class UserComponent implements OnInit {
  public userForm: FormGroup;
  public editForm: FormGroup;
  public submitted:Boolean;
  public status:Boolean;
  public userId:any;
  public userType:boolean;
  listUser : listUsers[];
  addUserProcess: any;
  editUserProcess: any;
  
  /**
 * @constructor
 * @param {FormBuilder} formBuilder
 * @param {Router} router
 * @param {ApiService} apiTable
 * @param {ToastrService} toastr
 */
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private apiTable: ApiService,
    private toastr: ToastrService,
    ) { }


/**
 * called initially
 */
  ngOnInit(): void {
    this.listTableUsers();
    this.submitted = false;
    this.userForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
    
  }

/**
 * Form getter
 */
  get formGet () { return this.userForm.controls; }
  
// fetch value for edit form
  edit(list:any){
    this.userId = list?.id;
    this.userType = true;
    this.userForm.patchValue({
      id: list?.id,
      first_name: list?.first_name,
      last_name: list?.last_name,
      email: list?.email,
      phone_number: list?.phone_number,
      password: list?.password,
      city: list?.city,
      state: list?.state,
      country: list?.country,
    })
  }
/**
 * Form on submit function
 * @param userForm
 */
   onSubmit (userForm:any):void{
    this.submitted = true;
    if (this.userForm.invalid) {
      this.toastr.error("Cannot Able to AddUser");
      return;
    }
    else{
      this.submitted = false;
    };
// Add user
    if(!this.userType){
    let obj = {
      first_name : userForm.value.first_name,
      last_name : userForm.value.last_name,
      phone_number : userForm.value.phone_number,
      city : userForm.value.city,
      state : userForm.value.state,
      country : userForm.value.country,
      email : userForm.value.email,
      password : userForm.value.password
    }
    this.apiTable.addUser(obj).subscribe(
      data => {
        this.addUserProcess = data;
        this.status = true;
        this.submitted = false;
        this.toastr.success(data.message);
        this.listTableUsers();
      },
      err => {
        console.log(err)
      }
    )
    this.userForm.reset();
    }
// Update user
    if(this.userType){
      let obj_update = {
        id : this.userId,
        first_name : userForm.value.first_name,
        last_name : userForm.value.last_name,
        phone_number : userForm.value.phone_number,
        city : userForm.value.city,
        state : userForm.value.state,
        country : userForm.value.country,
        email : userForm.value.email,
        password : userForm.value.password
      }
      this.apiTable.updateUser(obj_update).subscribe(
        data => {
          this.addUserProcess = data;
          this.status = true;
          this.userType = false;
          this.submitted = false;
          this.listTableUsers();
          this.toastr.success(data.message);
        },
        err => {
          console.log(err)
        }
      )
      this.userForm.reset();
    }
  }
//  Delete User
  delete(id:any){
    this.apiTable.deleteUser(id).subscribe(
      data => {
        this.addUserProcess = data;
        this.toastr.error(data.message);
        this.listTableUsers();
      },
      err => {
        console.log(err)
      }
    )
  }
// Get User Data
  listTableUsers(){
    this.apiTable.getUsersList().subscribe(
      (result: ResultTable) => {
        // success
        this.listUser = result.data;
      },
      (error) => {
        // error
        console.log(error)
      }
    )
  }
// Popup Modal close
  close(){
    this.userType = false;
    this.userForm.reset();
  }
}
