export default class ValidatorFieldBinding
{
	constructor(
		public bindingName:string,
		public bindingShorthand:string,
		public validatorFieldProp:string,
		public inheritFromContextProp:string = null,
		public clearValidationOnChange:boolean = true,
		public inheritFromAttribute:string = null)
	{
	}
}
