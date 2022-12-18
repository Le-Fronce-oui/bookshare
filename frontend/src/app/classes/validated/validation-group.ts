import { ValidatedField } from "./validated-field";

export class ValidationGroup<T> {

	private fields: ValidatedField<T>[];
	public ok: boolean;

	public constructor() {
		this.fields = [];
		this.ok = false;
	}

	public addField(field: ValidatedField<T>): void {
		this.fields.push(field);
		field.setPostCheck(() => this.updateValidity());
	}

	public updateValidity(): void {
		this.ok = this.fields.every(f => f.ok);
	}

	public reset(): void {
		for(let field of this.fields) {
			field.reset();
		}
		this.ok = false;
	}

}
