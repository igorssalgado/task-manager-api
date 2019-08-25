const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user')

const userOne = {
    name: 'Taynara',
    email: 'taynara@ex.com',
    password: '1234568!'
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'IRGU',
        email: 'igorssalgado@icloud.com',
        password: '1234568!'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email  + 'wrong',
        password: userOne.password + 'wrong'
    }).expect(400)
})