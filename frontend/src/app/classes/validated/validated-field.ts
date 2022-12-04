
export class ValidatedField<T> {

	public value: T;
	public ok: boolean;
	public dirty: boolean;

	private onDirtyChanged: (dirty: boolean) => void;
	private postCheck: (ok: boolean, peek: boolean) => void;

	public constructor(init: T, protected readonly validator: (val: T) => boolean) {
		this.value = init;
		this.ok = false;
		this.dirty = false;
		this.postCheck = (() => {});
		this.onDirtyChanged = (() => {});
	}

	protected validate(): boolean {
		return this.validator(this.value);
	}

	public peek(): void {
		this.ok = this.validate();
		if(this.ok) {
			this.setDirty(false);
		}
		this.postCheck(this.ok, this.dirty);
	}

	public check(): void {
		this.ok = this.validate();
		this.setDirty(!this.ok);;
		this.postCheck(this.ok, this.dirty);
	}

	public setPostCheck(postCheck: (ok: boolean, peek: boolean) => void): void {
		this.postCheck = postCheck;
	}

	public setOnDirtyChanged(onDirtyChanged: (dirty: boolean) => void): void {
		this.onDirtyChanged = onDirtyChanged;
	}

	protected setDirty(dirty: boolean): void {
		const old_dirty = this.dirty;
		this.dirty = dirty;
		if(old_dirty !== this.dirty) {
			this.onDirtyChanged(this.dirty);
		}
	}

	public makeDirty() {
		this.dirty = true;
		this.ok = false;
	}

}
