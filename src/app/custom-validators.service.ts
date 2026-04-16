import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static noFutureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return selected > today ? { futureDate: true } : null;
  }

  static patientNameLength(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const firstName = group.get('firstName')?.value;
      const lastName = group.get('lastName')?.value;

      if (firstName == null || lastName == null) {
        return null;
      }

      const firstLength = String(firstName).trim().length;
      const lastLength = String(lastName).trim().length;
      const invalid = (firstLength === 1 && lastLength <= 3) || (lastLength === 1 && firstLength <= 3);

      return invalid ? { patientNameLength: true } : null;
    };
  }
}
