import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from '../../../shared/services/medicine.service';
import { Medicine } from '../../../shared/models/medicine';

@Component({
  selector: 'app-update-medicine',
  templateUrl: './update-medicine.component.html',
  styleUrls: ['./update-medicine.component.css']
})
export class UpdateMedicineComponent implements OnInit {

  id: number;
  medicineForm!: FormGroup;
  submitted = false;

  constructor(
    private medicineService: MedicineService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.medicineForm = new FormGroup({
      id: new FormControl('', Validators.required),
      drugName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      stock: new FormControl('', [Validators.required, Validators.min(0)])
    });

    this.id = this.route.snapshot.params['id'];
    this.medicineService.getMedicineById(this.id).subscribe(
      data => {
        this.medicineForm.patchValue(data);
      },
      error => console.log(error)
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.medicineForm.valid) {
      const medicine: Medicine = this.medicineForm.value;
      this.medicineService.updateMedicine(this.id, medicine).subscribe(
        data => {
          this.goToMedicineList();
        },
        error => console.log(error)
      );
    }
  }

  goToMedicineList() {
    this.router.navigate(['/medicinelist']);
  }

}
