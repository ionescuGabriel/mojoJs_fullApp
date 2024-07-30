import mojo, {yamlConfigPlugin} from '@mojojs/core';
import User from './models/user.js';

export const app = mojo
({
    exceptionFormat: 'html',
    mode: 'development',
    secrets: ['5328375']
});

app.models.user = new User();

app.any('/').to('login#index').name('index');
app.get('/logout').to('login#logout');

const loggedIn = app.under('/').to('login#loggedIn');
loggedIn.get('/protected').to('login#protected');

app.start();