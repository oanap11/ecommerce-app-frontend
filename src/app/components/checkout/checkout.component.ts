import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidator } from '../../validators/custom-validator';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder, private formService: FormService, private cartService: CartService) {
  }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: this.createFormControlWithBasicValidation(),
        lastName: this.createFormControlWithBasicValidation(),
        email: this.createFormControlWithPatternValidation('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      }),    
      shippingAddress: this.initAddressFormGroup(),
      billingAddress: this.initAddressFormGroup(),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: this.createFormControlWithBasicValidation(),
        cardNumber: this.createFormControlWithPatternValidation('[0-9]{16}'),
        securityCode: this.createFormControlWithPatternValidation('[0-9]{3}'),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    this.formService.getCreditCardMonths(1).subscribe(
      data => { this.creditCardMonths = data; }
    );

    this.formService.getCreditCardYears().subscribe(
      data => { this.creditCardYears = data; }
    );

    this.formService.getCountries().subscribe(
      data => { this.countries = data; }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
    
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  initAddressFormGroup(): FormGroup {
    return this.formBuilder.group({
      street: this.createFormControlWithBasicValidation(),
      city: this.createFormControlWithBasicValidation(),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: this.createFormControlWithBasicValidation()
    });
  }

  private createFormControlWithBasicValidation(): FormControl {
    return new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      CustomValidator.notOnlyWhitespace
    ]);
  }

  private createFormControlWithPatternValidation(pattern: string): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern(pattern)]);
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => { this.totalQuantity = totalQuantity }
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => { this.totalPrice = totalPrice }
    );
  }

}
