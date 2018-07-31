# Salt

[![CircleCI](https://circleci.com/gh/nvbf/salt.svg?style=svg)](https://circleci.com/gh/nvbf/salt)

### Description

Beachvolleyballtournament signup and payment system.

### Development

you need to rename `.env.sample` to `.env` and fill inn all the blanks with correct values

then you are ready to go:

```
npm install
npm run dev
```

The system uses next.js so to understand whats going on look at their [good tutorial](https://nextjs.org/learn)

# Testing

## End to end testing.

We are using [cypress](http://cypress.io)

to run test do `./cypress.sh run`

to develop against run `./cypress.sh open`

### Production

hosted on heroku
push to Master = production.
