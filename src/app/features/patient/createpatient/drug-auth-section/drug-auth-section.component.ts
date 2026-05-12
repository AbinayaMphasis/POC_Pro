import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Drug, DrugSelectionService } from '../drug-selection.service';

@Component({
  selector: 'app-drug-auth-section',
  templateUrl: './drug-auth-section.component.html',
  styleUrls: ['./drug-auth-section.component.css']
})
export class DrugAuthSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;
  @Input() readonly = false;

  selectedDrug: Drug | null = null;
  private drugSub!: Subscription;

  constructor(private drugSelectionService: DrugSelectionService) {}

  ngOnInit(): void {
    this.drugSub = this.drugSelectionService.selectedDrug$.subscribe(drug => {
      this.selectedDrug = drug;
      const drugNameControl = this.drugAuthGroup?.get('drugName');
      if (!this.readonly && drug && drugNameControl) {
        drugNameControl.patchValue(drug.name, { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.drugSub?.unsubscribe();
  }

  get drugAuthGroup(): FormGroup {
    return this.patientForm.get('drugAuthorization') as FormGroup;
  }
}
