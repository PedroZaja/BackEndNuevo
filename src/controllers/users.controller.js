import UserService from "../services/users.service.js";

const userService = new UserService();

export const swapUserRole = async (req, res, next) => {
    try {

        const email = req.params.uid;

        let dbUser = await userService.swapUserRole(email);
        res.send( { status: 'success', data: dbUser } );
        
    } catch (error) {
        next(error)
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        let { uid } = req.params;
        let { reference } = req.body;
        let { files } = req;
        
        const user = await userService.uploadFiles(uid, files, reference);
        res.redirect('/uploads');

    } catch (error) {
        next(error)
    }
};