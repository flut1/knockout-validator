import KnockoutValidator from "../KnockoutValidator";
import qs from 'qs';

/**
 * Serializes the values of the given [[KnockoutValidator]] instance as an url
 * encoded string using the [qs](https://github.com/ljharb/qs) library.
 * @param validator The validator with the values to serialize
 */
const serialize = (validator:KnockoutValidator):string => qs.stringify(validator.getValues());

export default serialize;
