import {
  createTestServer,
  createTestServerWithSession,
} from '../../../../testHelpers/initTestServer';
import { invalidUUID } from '../../../../testHelpers/common';
import { mockImapService } from '../../../../__mocks__/ImapService';
import { mockNodemailer } from '../../../../__mocks__/nodemailer';
import {
  seedUserEmailConfig,
  userEmailConfigData,
} from '../../../seeds/userEmailConfig';
import { seedUsers } from '../../../seeds/user-seed';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

const PATH = (id: string) => `/api/app/v1/users/email-config/${id}`;

describe(`Update user email config [PUT] ${PATH}`, async function () {
  before(async () => {
    mockNodemailer();
    mockImapService();
  });

  let userID;
  let demoUserID;
  let configID;
  beforeEach(async () => {
    [userID, demoUserID] = await seedUsers();
    const config = await seedUserEmailConfig(userID);
    configID = config.id;
  });

  it('Should get status 401', async function () {
    const server: any = createTestServer();

    const response: any = await request(server)
      .put(PATH(configID))
      .send(userEmailConfigData);

    const { status } = response;

    assert.equal(status, 401);
  });

  it('Should get status 404', async function () {
    const server: any = createTestServerWithSession(userID);

    const response: any = await request(server)
      .put(PATH(invalidUUID))
      .send(userEmailConfigData);

    const { status } = response;

    assert.equal(status, 404);
  });

  it('Should get status 200 ', async function () {
    const server: any = createTestServerWithSession(userID);

    const response: any = await request(server)
      .put(PATH(configID))
      .send(userEmailConfigData);

    const { status } = response;

    assert.equal(status, 200);
  });

  it('Should get status 403 forbidden', async function () {
    const server: any = createTestServerWithSession(demoUserID);

    const response: any = await request(server)
      .put(PATH(configID))
      .send(userEmailConfigData);

    const { status } = response;

    assert.equal(status, 403);
  });
});
