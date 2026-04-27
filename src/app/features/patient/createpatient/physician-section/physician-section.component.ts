import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DrugSelectionService } from '../drug-selection.service';
import { Drug } from '../drug-selection.service';

@Component({
  selector: 'app-physician-section',
  templateUrl: './physician-section.component.html',
  styleUrls: ['./physician-section.component.css']
})
export class PhysicianSectionComponent implements OnInit, OnDestroy {
  @Input() patientForm!: FormGroup;
  @Input() readonly = false;

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

  get physicianGroup(): FormGroup {
    return this.patientForm.get('physician') as FormGroup;
  }

  ctrl(name: string): AbstractControl | null {
    return this.patientForm.get(['physician', name]);
  }

  isInvalid(name: string): boolean {
    const c = this.ctrl(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  hasFieldError(name: string, error: string): boolean {
    const c = this.ctrl(name);
    return !!c && !!c.errors?.[error] && (c.dirty || c.touched);
  }
}
