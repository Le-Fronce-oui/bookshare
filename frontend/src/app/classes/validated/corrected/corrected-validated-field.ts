import { ValidatedField } from "../validated-field";

export class CorrectedValidatedField<T> extends ValidatedField<T> {

	public constructor(init: T, validator: (val: T) => boolean, private readonly mutator: (val: T) => T) {
		super(init, validator);
	}

	protected validate(): boolean {
		return this.validator(this.mutator(this.value));
	}

	public check(): void {
		this.value = this.mutator(this.value);
		super.check();
	}

}
