import { ErrorHandler } from "src/types/functions";

export function manageError(e: any, callback?: ErrorHandler) {
	console.error(e);
	if(callback !== undefined) {
		callback(e);
	}
}
