import DatabaseLoan from "src/database/models/loan";

export function loanPriority(loan: DatabaseLoan): number {
	if(loan.acceptedAt === null && loan.declinedAt === null) {
		return 1;
	}
	if(loan.declinedAt !== null) {
		return 5;
	}
	if(loan.borrowedAt === null) {
		return 2;
	}
	if(loan.returnedAt === null) {
		return 3
	}
	return 4;
}
