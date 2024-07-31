import mojo, {yamlConfigPlugin} from '@mojojs/core';
import Users from './models/users.js';
import Posts from './models/posts.js';
import Pg from '@mojojs/pg';

export const app = mojo
({
    exceptionFormat: 'html',
    mode: 'development',
    secrets: ['5328375']
});

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;

app.onStart(async app => {
    if (app.models.pg === undefined)
        app.models.pg = new Pg(app.config.pg);
    app.models.users = new Users(app.models.pg);
    app.models.posts = new Posts(app.models.pg);
  
    const migrations = app.models.pg.migrations;
    await migrations.fromFile(app.home.child('migrations', 'userboards.sql'), {name: 'userboards'});
    await migrations.migrate();
  });

app.any('/').to('login#index').name('index');
app.get('/logout').to('login#logout');

const loggedIn = app.under('/').to('login#loggedIn');
loggedIn.get('/protected').to('login#protected');
loggedIn.get('/users/:id').to('login#account').name('account');
loggedIn.post('/users/:id').to('login#create').name('create');

app.start();