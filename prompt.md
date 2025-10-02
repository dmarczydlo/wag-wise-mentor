I would like to extends the current application to create fully working puppy mentor app.
I should include the following features:

- puppy definition with birthday, picture
- calendar with all necessary events like: Visit to veterinary medicine, vaccinations, and all necessary monthly events.
- daily routines - it should based on the aga on the puppy (dog) describe some hits about the daily routines
- Exercises and training - a list of tasks/games to teach your dog good behaviors such as staying at home, playing with children, peeing routines, etc.,
- Reminders about the events and the "dinner" time for the puppy

My stack should be:

- Nest.js (backend) and React frontend,
- Responsive design - I would like to use it on my phone as well
- Integration with some Db - it could be supabase
- Auth -> it could be supabase
- I would like to have option to define the puppy and share by somebody else (like wife) based on login the information about the puppy should be shared.
- AI boost. WHen you define your puppy (birthday,dog breed and all important info) - all necessary setup should be created by default like: calendar, daily routines, Exercises
  all information should evolve based on puppy scores (information how puppy works with Exercises what can do etc)
- Push notification based on free solution (supabase?)
- The integration with AI should be flexible. I would like to use multiple AI, change when will be too costly -> move it to the last step.
- Invitation flow. New user has to bee invited to the system by admin role
- 2 roles:

  - admin
  - owner

DON'T build the App. Came up with the plan using .taskmaster/templates/example_prd.txt

Check the current project and use it as starting point.
Use monorepo to setup FE and BE
PLease use BUN instead of Node
Save the plan to scripts/PRD.txt
