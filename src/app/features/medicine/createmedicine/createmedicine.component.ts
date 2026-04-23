import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medicine } from '../../../shared/models/medicine';
import { MedicineService } from '../../../shared/services/medicine.service';

@Component({
  selector: 'app-createmedicine',
  templateUrl: './createmedicine.component.html',
  styleUrls: ['./createmedicine.component.css']
})
export class CreatemedicineComponent implements OnInit {

  medicineForm!: FormGroup;
  submitted = false;

  constructor(
    private medicineService: MedicineService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.medicineForm = new FormGroup({
      id: new FormControl('', Validators.required),
      drugName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      stock: new FormControl('', [Validators.required, Validators.min(0)])
    });
  }

  saveMedicine() {
    if (this.medicineForm.invalid) {
      return;
    }
    const medicine: Medicine = this.medicineForm.value;
    this.medicineService.createMedicine(medicine).subscribe(
      data => {
        this.goToMedicineList();
      },
      error => console.log(error)
    );
  }

  goToMedicineList() {
    this.router.navigate(['/medicinelist']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.medicineForm.valid) {
      this.saveMedicine();
    }
  }

}
