import mojo, {yamlConfigPlugin} from '@mojojs/core';
import User from './models/user.js';

export const app = mojo
({
    exceptionFormat: 'html',
    mode: 'development',
    secrets: ['Mojolicious rocks']
});

app.models.user = new User();

app.any('/', async ctx => {

    const params = await ctx.params();
    const user = params.get('user');
    const pass = params.get('pass');

    if (ctx.models.user.check(user, pass) === false)
    {
        //return await ctx.render({inline: indexTemplate, inlineLayout: defaultLayout});
        return await ctx.render({view: 'index'});
    }
    
    const session = await ctx.session();
    session.user = user;

    const flash = await ctx.flash();
    flash.message = 'Thanks for logging in.';

    await ctx.redirectTo('protected');
}).name('index');

const loggedIn = app.under('/').to(async ctx => {

    const session = await ctx.session();
    if (session.user !== undefined) return;
    await ctx.redirectTo('index');
    return false;
});

loggedIn.get('/protected').to(async ctx => {
    //await ctx.render({inline: protectedTemplate, inlineLayout: defaultLayout});
    await ctx.render({view: 'protected'});
});

app.get('/logout', async ctx => {

    const session = await ctx.session();
    session.expires = 1;
  
    await ctx.redirectTo('index');
});

app.start();