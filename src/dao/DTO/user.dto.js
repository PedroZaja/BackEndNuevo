export default class UserDTO {
    constructor(user){
        // Send this information alone for current
        this.name = user.name,
        this.role = user.role
    }
}