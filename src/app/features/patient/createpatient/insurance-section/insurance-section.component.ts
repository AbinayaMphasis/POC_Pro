import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug-selection.service';

@Component({
  selector: 'app-insurance-section',
  templateUrl: './insurance-section.component.html',
  styleUrls: ['./insurance-section.component.css']
})
export class InsuranceSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;

  selectedDrug: Drug | null = null;
  private drugSub!: Subscription;

  constructor(private drugSelectionService: DrugSelectionService) {}

  ngOnInit(): void {
    this.drugSub = this.drugSelectionService.selectedDrug$.subscribe(
      drug => (this.selectedDrug = drug)
    );
  }

  ngOnDestroy(): void {
    this.drugSub?.unsubscribe();
  }

  get insuranceGroup(): FormGroup {
    return this.patientForm.get('insuranceDetails') as FormGroup;
  }
}
