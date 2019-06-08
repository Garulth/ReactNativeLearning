import faker from 'faker';

export const users = [...new Array(50)].map(m => ({
  avatar: faker.internet.avatar(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  description: faker.lorem.sentence(15),
  job: faker.name.jobType(),
  phoneNumber: faker.phone.phoneNumberFormat()
}))
