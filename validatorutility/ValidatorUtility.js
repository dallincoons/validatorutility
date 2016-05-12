

define('ValidatorUtility', ['underscore'], function(_){

	function validate(formSelector, validations){

		var $form 			 = $(formSelector),
			customValidations = arguments[2],
			errors = {
				'fields' : [],
				'type'   : '',
				'message': ''
		};

		if("notEmpty" in validations && validations.notEmpty.length > 0){

			_.each(validations.notEmpty, function(input){
				if($.trim($(input).val()) == ''){

					errors.fields.push(input);

				}
			});

			if(errors.fields.length > 0){

				errors.type    = "notEmpty";
				errors.message = "Required fields are missing";

				return errors;
			}

		}

		if("validEmail" in validations && validations.validEmail.length > 0){

			_.each(validations.validEmail, function(input){

				if(isInvalidEmail($(input).val())){

					errors.fields.push(input);

				}

			});

			if(errors.fields.length > 0){

				errors.type    = "invalidEmail";
				errors.message = "Please enter a valid email";

				return errors;
			}

		}

		if("validPhone" in validations && validations.validPhone.length > 0){

			_.each(validations.validPhone, function(input){

				if(isInvalidPhone($(input).val())){

					errors.fields.push(input);

				}

			});

			if(errors.fields.length > 0){

				errors.type    = "invalidPhone";
				errors.message = "Please enter a valid phone number";

				return errors;
			}

		}

		//third argument contains custom validation routines
		if(!_.isUndefined(customValidations) && _.isObject(customValidations)){

			var customErrors = {
				message : '',
				type : '',
				fields : []
			},
			invalid = false;

			//call each custom validation and pass errors object by reference
			for(var customVal in customValidations){

				_.each(validations[customVal], function(input){

					customErrors = customValidations[customVal](input);

					if(customErrors.isInvalid === true){

						errors.fields.push(input);
						invalid = true;

					}

				});

				if(invalid) {
					try {

						errors.type = customVal;

					} catch (e) {
						throw 'missing type in custom validation'
					}

					try {

						errors.message = customErrors.message;

					} catch (e) {
						throw "missing message in custom validation"
					}

					return errors;
				}

			}
		}

		//if there are no errors
		return errors;

	}

	function isInvalidEmail(email){

		/**
		 *
		 * @param email - value of input field
		 * @returns {boolean}
		 */
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;

		return (!re.test(email));

	}

	function isInvalidPhone(phone){

		/**
		 *
		 * @param email - value of input field
		 * @returns {boolean}
		 */
		var re     = /^[0-9]+$/g,
			length = phone.length;

		return (!re.test(phone)) || (length > 25 || length < 8);

	}

	return {

		validate : validate

	}

});
