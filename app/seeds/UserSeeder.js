module.exports = class UserSeeder {

    constructor() {
        this.user_model = resolveOnce('app.models.UserModel')

        this.permissions = []
    }

    async up() {
        const user_model = new this.user_model(this.makeUser())
        let user_exists = await this.user_model.find({ email: "admin@appname.com" })
        if (user_exists.length == 0) {
            let user_response = await user_model.save()
            console.log('User seeded: ', user_response._id)
        } else {
            console.log('User already seeded.')
        }
    }

    makeUser() {
        return {
            device_id: "admin",
            name: "Super Admin",
            email: "admin@appname.com",
            phone: "",
            password: auth.hashPassword('123', Config.app('salt')),
            image: null,
            status: "active",
            type: 'admin',
            token: '',
            blocked_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        }
    }

}