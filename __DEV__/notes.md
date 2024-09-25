## Notes

### Deploying with Docker is hard and potentially expensive

- For a project with this scope, a Go backend probably isn't even needed.
- Hosting a docker image on DigitalOcean costs money. Hosting a Next app on Vercel is free! (with paid options for upscaling)
- If anything, the scalability will come from using an efficient DB.
  - For v1, PostgreSQL on Vercel is probably fine (and it's free)
  - Vercel has easy tool for dumping the DB, so migrating to something robust like AWS should be pretty painless.
  - Moving to AWS should only be done once everything is really clamped down. A small bug can cost a lot of money on AWS.

### Coding the Autocomplete was actually pretty simple

- https://leonardomontini.dev/shadcn-autocomplete/

### Shadcn-UI Components - https://ui.shadcn.com/

- Button
- Command
- Input
- Popover
- Skeleton

### API Libraries

- PostgreSQL
  - ts-postgres: https://www.npmjs.com/package/ts-postgres
  - postgres.js (looks better): https://github.com/porsager/postgres
- Spotify
  - Getting started: https://developer.spotify.com/documentation/web-api/tutorials/getting-started
  - TypeScript Library: https://developer.spotify.com/blog/2023-07-03-typescript-sdk
- OpenAI
  - Overview: https://platform.openai.com/docs/overview
  - Quickstart: https://platform.openai.com/docs/quickstart

### Other useful links

- TailwindCSS: https://tailwindcss.com/
- HeroIcons: https://heroicons.com/

## Data Engineering

For a given track:

- database ID
- spotify track ID
- accessibility fields: name/album/artist
- what OpenAI says
- what the users say
- overall determination
- link to original track (in database, nullable)

## Voting

- Some Asumptions:

  - Not everyone who looks will vote (probably 10% or less)
  - Users are extremly unlikely to create an account just to vote
  - People are more likely to correct false information than to confirm true information
  - Some people are assholes and will abuse any system we build

- Should be a way to manually override the determination for known truths
- Ask the right question!
  - "What do you think - is this a cover?" might be better than "Did we get it right?"
- Collect the right data!
  - Knowing if the vote was a "correction" at the time of voting is important for weighing the vote

Algo:

- D_initial = initial guess from OpenAI, true or false

- V_yes_reject = number of votes that the track IS a cover and the determination is wrong
- V_yes_confirm = number of votes that the track IS a cover and the determination is correct
- V_no_reject
- V_no_confirm
- W_reject = weight of a correction vote
- W_confirm = weight of a confirmation vote

## How to keep users from voting mutliple times?

- local storage / cookie?
  - spotify track ID -> isCover
  - users can clear this to vote again if they want
- OAuth
  - make users log in before they can vote
  - may prevent valid votes from users who don't want to make an account
