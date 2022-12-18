import { getOrganisationById, isAdminInOrg, setUserOrgBan, setUserOrgRole } from "../../database/queries/organisations";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";

router.post('/organisation/:org_id/ban/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	isAdminInOrg(org_id, req_user_id, ok => {
		if(ok === null) {
			res.sendStatus(404);
			return;
		}
		if(!ok) {
			res.sendStatus(403);
			return;
		}
		setUserOrgBan(org_id, user_id, true, ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

router.delete('/organisation/:org_id/ban/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	isAdminInOrg(org_id, req_user_id, ok => {
		if(ok === null) {
			res.sendStatus(404);
			return;
		}
		if(!ok) {
			res.sendStatus(403);
			return;
		}
		setUserOrgBan(org_id, user_id, false, ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});


router.post('/organisation/:org_id/admin/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	getOrganisationById(org_id, req_user_id, org => {
		if(org === null) {
			res.sendStatus(404);
			return;
		}
		if(org.ownerId !== req_user_id) {
			res.sendStatus(403);
			return;
		}
		setUserOrgRole(org_id, user_id, 'ADMIN', ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

router.delete('/organisation/:org_id/admin/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	getOrganisationById(org_id, req_user_id, org => {
		if(org === null) {
			res.sendStatus(404);
			return;
		}
		if(org.ownerId !== req_user_id) {
			res.sendStatus(403);
			return;
		}
		setUserOrgRole(org_id, user_id, 'USER', ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

