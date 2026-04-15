import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug.model';

@Component({
  selector: 'app-medical-history-section',
  templateUrl: './medical-history-section.component.html',
  styleUrls: ['./medical-history-section.component.css']
})
export class MedicalHistorySectionComponent implements OnInit, OnDestroy {
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

  get medHistoryGroup(): FormGroup {
    return this.patientForm.get('medicalHistory') as FormGroup;
  }
}
