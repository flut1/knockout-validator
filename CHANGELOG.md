# Changelog

## v1.0.0
This version was based of the _KnockoutValidator.ts_ class that has not been published to Github. As this is a complete rewrite, there are a lot of breaking changes. You can find differences between this class and knockout-validator v1.0.0 below.

### Named validation rules
You can now apply multiple named validation rules to a single field. The example below validates with the functions _validateMinLength()_ and _checkNumbers()_ and the results named _minLength_ and _containsNumbers_.
```html
<input type="password" name="password" data-bind="validationRule: {minLength: validateMinLength, containsNumbers: checkNumbers}">
```
You can now access the validation state of the _password_ input, but also of each field individually:
```typescript
validator.fields('password').isValid(); // returns true if both rules are valid
validator.fields('password').rule('minLength').isValid(); // returns true if validateMinLength() returned true
validator.fields('password').rule('containsNumbers').isValid(); // returns true if checkNumbers() returned true
```

### Bindings validateWith and validator merged
The _validator_ binding that was used to indicate which _KnockoutValidator_ instance to use for a single field, has been merged into the _validateWith_ binding. The _validateWith_ binding can now be applied both to a single field and a container element containing multiple fields.

### Validation groups
You can now create _InputGroupValidation_ instances to run validation based on the value of multiple fields. This replaces the *global rule* functionalities of the previous KnockoutValidation. One common example for group validation is validating a date of birth:
```html
<input type="text" name="day" data-bind="validationRule: validateDay, validationGroup: dateOfBirth">
<input type="text" name="month" data-bind="validationRule: validateMonth, validationGroup: dateOfBirth">
<input type="text" name="year" data-bind="validationRule: validateYear, validationGroup: dateOfBirth">
```
```typescript
// in your ViewModel
import {InputGroupValidation} from 'knockout-validator';
public dateOfBirth = new InputGroupValidation(values =>
{
   // values are available as values.day, values.month and values.year
   ...
   return isValid;
}); 
```
For a more detailed explanation please see the API documentation

### Validate binding shorthand
Instead of using multiple bindings, you can now use the shortcut binding _validate_:
```html
<!-- without shorthand !-->
<input type="text" name="day" data-bind="validationRule: validateDay, validationGroup: dateOfBirth, validateOn: 'value', validateWith: signupValidator">
<!-- with shorthand !-->
<input type="text" name="day" data-bind="validate: {rule : validateDay, group: dateOfBirth, on: value, with: signupValidator}">
```

### Individual field validation
You can now manually trigger validation on a single field by calling `validator.fields('fieldname').validate()`

### String return values of validation functions are no longer considered errors
In the previous KnockoutValidator, if a field needed to be validated for multiple rules you could return a string like so:
```typescript
/* OLD EXAMPLE -- THIS CODE NO LONGER WORKS */
function validatePassword(password:string):string|boolean
{
   if(password.length < 5) 
   {
      return 'This password is too short';
   }
   if(password.match(/^[a-zA-Z]*$/))
   {
      return 'The password should contain at least one non-letter character';
   }
   return true;
}
```
You could then read the errors from the _errors_ observable on a field. This approach was not very flexible as you could only return 1 error and it was difficult to apply localization on the error messages. **In knockout-validator v1.0.0, a string return value is interpreted as _true_**. This problem should now be solved with _named rules_ (see above).

### Validation state
 - The _isValid_ observable on the validator has been changed to a read-only computed value.
 - The _errors_ property of fields has been removed in favor of named validation rules
 - The _isValidated_ computed value of a field now also exists on the KnockoutValidator instance

### KnockoutValidator options
 - The _validClassname_, _invalidClassname_ and _validatingAsyncClassname_ options are now under the _classnames_ property.
 - The static _ATTRIBUTE_NAMESPACE_ property has been removed
 - The _asyncTimeout_ is now called _asyncValidationTimeout_.

