import mojo, {yamlConfigPlugin} from '@mojojs/core';
import Users from './models/users.js';

export const app = mojo
({
    exceptionFormat: 'html',
    mode: 'development',
    secrets: ['Mojolicious rocks']
});

app.models.users = new Users();

app.any('/', async ctx => {

    // Query or POST parameters
    const params = await ctx.params();
    const user = params.get('user');
    const pass = params.get('pass');

    if (ctx.models.users.check(user, pass) === false)
    {
        return await ctx.render({inline: indexTemplate, inlineLayout: defaultLayout});
    }
    
    const session = await ctx.session();
    session.user = user;

    const flash = await ctx.flash();
    flash.message = 'Thanks for logging in.';

    await ctx.redirectTo('protected');
}).name('index');

const loggedIn = app.under('/').to(async ctx => {

    // Redirect to main page with a 302 response if user is not logged in
    const session = await ctx.session();
    if (session.user !== undefined) return;
    await ctx.redirectTo('index');
    return false;
});

loggedIn.get('/protected').to(async ctx => {
    await ctx.render({inline: protectedTemplate, inlineLayout: defaultLayout});
});

app.get('/logout', async ctx => {

    // Expire and in turn clear session automatically
    const session = await ctx.session();
    session.expires = 1;
  
    // Redirect to main page with a 302 response
    await ctx.redirectTo('index');
});

// app.any('/', async ctx => {

//     // Query or POST parameters
//     const params = await ctx.params();
//     const user = params.get('user')
//     const pass = params.get('pass')
  
//     // Check password
//     if(ctx.models.users.check(user, pass) === true) return await ctx.render({text: `Welcome ${user}.`});
  
//     // Failed
//     return await ctx.render({text: 'Wrong username or password.'});
//   });

app.start();

const indexTemplate = `
% const params = await ctx.params();
<form method="post">
  % if (params.get('user') !== null) {
    <b>Wrong name or password, please try again.</b><br>
  % }
  User:<br>
  <input name="user">
  <br>Password:<br>
  <input type="password" name="pass">
  <br>
  <button type="submit">Log in</button>
</form>
`;

const protectedTemplate = `
% const flash = await ctx.flash();
% if (flash.message != null) {
  <b><%= flash.message %></b><br>
% }
% const session = await ctx.session();
Welcome <%= session.user %>.<br>
%= await tags.linkTo('logout', {}, 'Logout')
`;

const defaultLayout = `
<!DOCTYPE html>
<html>
  <head><title>Login Manager</title></head>
  <body><%== ctx.content.main %></body>
</html>
`;