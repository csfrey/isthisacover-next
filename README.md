# Is This A Cover?
View the live demo here --> https://isthisacover.vercel.app <--

<img src="https://i.imgur.com/oUwiPYY.png" alt="Determination page" />

## Summary
IsThisACover is a webapp written in Next.js that uses OpenAI to determine if a track in Spotify's library is a cover. After the AI has made a determination, users are able to vote on it, potentially changing the determination. The app is currently in a proof-of-concept state, but is nominally fully functional.

### AI-Generated Determinations
Using AI to create initial determinations presents a number of challenges. The most obvious challenges are cost and potential errors. Currently I am happy to eat the cost of running the site since GPT 4o-mini is so cheap, but if the site ever gains traction, I intend to mitigate operating costs by running banner ads.

The error problem is the onus for implementing the voting system which I describe below.

### Voting System
In order to mitigate the fact that AI sometimes gets things wrong, I've implemented a rudimentary system for users to validate the AI-generated determinations through simple yes/no votes - "Yes this a cover" or "No, this is not a cover." The naive approach from there would be to use a simple majority after a certain threshold of votes. However, user behavior on the open internet is subject to [Cunningham's Law](https://en.wikipedia.org/wiki/Ward_Cunningham#:~:text="Cunningham%27s%20Law",-For%20the%20mathematical&text=Cunningham%20is%20credited%20with%20the,than%20to%20answer%20a%20question), which in this case means it is more likely that a user will vote in order to correct rather than confirm. For this reason, votes which seek to correct a determination are weighted slightly less than votes which confirm.

### Mitigating Abuse
In the current alpha version, there is nothing to stop a user from voting a virtually unlimited number of times on any one song, skewing the results. The risk is that I would need to manually clean up the database, possibly needing to delete multiple determinations that would then need to be reassessed by the AI. In the future I plan to mitigate this behavior and am currently researching option (if you have suggestions, please reach out to me at contact@charliefrey.io)
