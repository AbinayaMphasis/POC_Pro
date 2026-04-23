import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug.model';
import { ConsentEntry, getConsentByDrugAndType } from '../../../../shared/constants/consent-content';

@Component({
  selector: 'app-consent-section',
  templateUrl: './consent-section.component.html',
  styleUrls: ['./consent-section.component.css']
})
export class ConsentSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;

  selectedDrug: Drug | null = null;
  patientConsent: ConsentEntry | undefined;
  physicianConsent: ConsentEntry | undefined;
  private drugSub!: Subscription;

  constructor(private drugSelectionService: DrugSelectionService) {}

  ngOnInit(): void {
    this.drugSub = this.drugSelectionService.selectedDrug$.subscribe(drug => {
      this.selectedDrug = drug;
      this.updateConsentContent(drug);
    });
  }

  ngOnDestroy(): void {
    this.drugSub?.unsubscribe();
  }

  private updateConsentContent(drug: Drug | null): void {
    if (drug) {
      this.patientConsent = getConsentByDrugAndType(drug.drugId, 'patient');
      this.physicianConsent = getConsentByDrugAndType(drug.drugId, 'physician');
    } else {
      this.patientConsent = undefined;
      this.physicianConsent = undefined;
    }
  }

  readonly maxDate = new Date();

  get consentGroup(): FormGroup {
    return this.patientForm.get('consentForTreatment') as FormGroup;
  }

  ctrl(name: string): AbstractControl | null {
    return this.patientForm.get(['consentForTreatment', name]);
  }

  isInvalid(name: string): boolean {
    const c = this.ctrl(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  hasError(name: string, error: string): boolean {
    const c = this.ctrl(name);
    return !!c && !!c.errors?.[error] && (c.dirty || c.touched);
  }

  get consentGiven(): boolean | null {
    return this.ctrl('consentGiven')?.value ?? null;
  }

  get physicianConsentGiven(): boolean | null {
    return this.ctrl('physicianConsentGiven')?.value ?? null;
  }
}
