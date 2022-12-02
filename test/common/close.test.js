

/** NOTE: User should be always the last delete!!! */
describe('/DELETE users', () => {
    it('it should DELETE user', (done) => {
        chai.request(express_application)
            .delete('/user/' + user_id)
            .set('Authorization', 'Bearer ' + __token)
            .end((err, res) => {
                res.should.have.status(200)
                if (fs.existsSync(root_directory + '/public/user_images/' + user_image)) {
                    fs.unlinkSync(root_directory + '/public/user_images/' + user_image)
                }
                done()
            })
    })
})




describe('Closing', function() {
    describe('exit()', function() {
        it('should exit test cases gracefully', async() => {
            expect({}).to.be.an('object')
            await __mongoose.disconnect()
        })
    })
})