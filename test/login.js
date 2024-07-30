import {app} from '../index.js';
import t from 'tap';

t.test('Example application', async t => {
  const ua = await app.newTestUserAgent({tap: t, maxRedirects: 1});

  await t.test('Index', async t => {
    (await ua.getOk('/'))
      .statusIs(200)
      .elementExists('form input[name="user"]')
      .elementExists('form input[name="pass"]')
      .elementExists('button[type="submit"]');
     (await ua.postOk('/', {form: {user: 'sebastian', pass: 'secr3t'}}))
       .statusIs(200);

    // Test accessing a protected page
    (await ua.getOk('/protected')).statusIs(200).textLike('a', /Logout/);

    // Test if HTML login form shows up again after logout
    (await ua.getOk('/logout'))
      .statusIs(200)
      .elementExists('form input[name="user"]')
      .elementExists('form input[name="pass"]')
      .elementExists('button[type="submit"]');
  });

  await ua.stop();
});