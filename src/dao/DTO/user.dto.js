export default class UserDTO {
    constructor(user){
        // Send this information alone for current
        this.name = `${user.first_name} ${user.last_name}`,
        this.role = user.role,
        this.email = user.email,
        this.password = user.password,
        this.age = user.age
    }
}