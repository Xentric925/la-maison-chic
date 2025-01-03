import { markJobAsCompleted } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const sgMail = require('@sendgrid/mail');

const requiredEnvVars = ['SENDGRID_API_KEY'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not defined in the environment variables.`);
  }
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendLoginEmail = async (to: string, token: string, id: number) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: process.env.SENDGRID_LOGIN_TEMPLATE,
    dynamicTemplateData: {
      login_link: `${process.env.ORIGIN}/login/${token}`,
    },
  };

  try {
    await sgMail.send(msg);
    await markJobAsCompleted(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
