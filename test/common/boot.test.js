global.express = require('express')
const { exec } = require('child_process')
global.chai = require('chai')
global.chai_http = require('chai-http')
global.fs = require('fs')
global.should = chai.should()
global.expect = require('chai').expect

const Application = require('../../core/application.js')
new Application().run()

exec('redis-cli FLUSHALL')

global.user_id = ''
global.user_image = ''

chai.use(chai_http)


describe('Authentication', () => {
    describe('/POST Login', () => {
        it('it should login user', (done) => {
            chai.request(express_application)
                .post('/login')
                .send({ email: 'admin@test.com', password: '123' })
                .end((err, res) => {
                    res.should.have.status(200)
                    __token = res.body.token
                    done()
                })
        })
    })
})