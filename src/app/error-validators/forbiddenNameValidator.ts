import { ValidatorFn, AbstractControl, ControlContainer } from '@angular/forms';

// factory function koja pravi custom validator za string koji unosimo u FormControl validatoru
//kada zelimo da ogranicimo unos odredjenih reci u input polja :)
export function forbiddenNameValidator(forbiddenName:RegExp): ValidatorFn{
    return (control:AbstractControl):{[key:string]:any } | null=>{
        const forbidden=forbiddenName.test(control.value)
        return forbidden? {"forbiddenName":{value:control.value}}: null;
    }

    
}