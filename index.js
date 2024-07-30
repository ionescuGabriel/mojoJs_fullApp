import mojo, {yamlConfigPlugin} from '@mojojs/core';
import User from './models/user.js';

export const app = mojo
({
    exceptionFormat: 'html',
    mode: 'development',
    secrets: ['5328375']
});

app.models.user = new User();

//app.any('/').to('login#index').name('index');
app.get('/logout').to('login#logout');

const loggedIn = app.under('/').to('login#loggedIn');
loggedIn.get('/protected').to('login#protected');

app.any('/', async ctx => {

    const params = await ctx.params();
    const user = params.get('user');
    const pass = params.get('pass');

    if (ctx.models.user.check(user, pass) === false)
    {
        return await ctx.render({view: 'index'});
    }
    
    const session = await ctx.session();
    session.user = user;

    const flash = await ctx.flash();
    flash.message = 'Thanks for logging in.';

    await ctx.redirectTo('protected');
}).name('index');

app.start();