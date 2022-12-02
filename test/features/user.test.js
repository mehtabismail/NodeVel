global.login = {email: '', password: ''}

describe('Users', async () => {    

    describe('/POST users', () => {
        it('it should create the user', (done) => {
            chai.request(express_application)
                .post('/user')
                .set('Authorization', 'Bearer ' + __token)
                .send({
                    email: "test@test.com",
                    password:"123",
                    name: "test",
                    phone: "012345678",
                    dob:"12-12-2000",
                    device_id:"1234",  
                    gender:"male",
                    photo:null,
                    type:"admin",    
                    status:"active",    
                    blocked_at: null,
                    verified_at: null,
                    reset_password_created_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.user.should.have.property('email')
                    user_id = res.body.user._ids
                    login.email = res.body.user.email
                    done()
                })
        })
    })

})