import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {

    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {
        if((control.value != null) && (control.value.trim() === "")){
            return { 'notOnlyWhitespace': true };
        }
        else {
            return null;
        }
    }
}
