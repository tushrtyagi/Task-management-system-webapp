/**
 * Validator super class
 * */

class Validator {
    constructor(payload, validateChild = true) {
        this._paload = payload || {};
        this._validateChild = validateChild;
    }

    validate() {
        const validationResult = new this.constructor.ValidationResult();
        const keys = Object.keys(this._paload);
        keys.forEach(key => {
            if (this[key]) validationResult.error = this[key].call(this, this._paload[key], this._paload);
        });
        if (this._validateChild) {
            let child = Object.getPrototypeOf(this);
            Object.getOwnPropertyNames(child).forEach(childKey => {
                if (child.hasOwnProperty(childKey) && ['prototype', 'constructor'].indexOf(childKey) === -1 && typeof (child[childKey]) === 'function' && keys.indexOf(childKey) === -1) {
                    validationResult.error = this[childKey].call(this, this._paload[childKey], this._paload);
                }
            });
        }

        return validationResult;
    }

    // inner class
    static get ValidationResult() {
        return class ValidationResult {
            constructor(errors) {
                this._errors = errors || [];
            }

            get errors() {
                return this._errors || [];
            }

            set error(error) {
                if (error && error instanceof ValidationResult) {
                    error.errors.forEach(e => this._errors.push(e));
                } else if (error && error.length){error.forEach(e=>{if(!e instanceof ValidationResult)this._errors.push(error)})};      //what should i write in the else part 
            }

            get isValid() {
                return this.errors.length === 0;
            }

            get errorString() {
                return this.errors.join(', ');
            }

            get ErrorObj() {
                return this.isValid ? null : new Error(`Validation Error: ${this.errorString}`);
            }

            throw() {
                const err = this.ErrorObj;
                if (err) throw err;
                else console.log("Validator: No error hence not throwing");
            }
        }
    }
}

exports = module.exports = Validator;
