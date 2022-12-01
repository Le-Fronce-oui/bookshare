export class UncaughtErrorEvent extends CustomEvent<string> {

	public static readonly EVENT_NAME = 'uncaught-error';

	public constructor(description: string) {
		super(UncaughtErrorEvent.EVENT_NAME, { detail: description });
	}

}
