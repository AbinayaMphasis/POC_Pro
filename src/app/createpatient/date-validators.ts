import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Rejects dates that are in the future (today is valid). */
export function noFutureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) { return null; }
  const selected = new Date(control.value);
  const today    = new Date();
  today.setHours(23, 59, 59, 999);           // allow today fully
  return selected > today ? { futureDate: true } : null;
}

/** Returns today's date as yyyy-MM-dd for use in [max] bindings. */
export function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}
