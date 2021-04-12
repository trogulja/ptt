# Productive Time Tracking app

It's live on https://ptt.rogulja.info/

# Build Setup

Assignment app, instructions received via e-mail. A VueJS + Vuetify app.

## Serve

```
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn serve

# run linter
yarn lint

# build for production
yarn build
```

# ToDo

- [ ] login page
  - [ ] layout
  - [ ] hardcoded user token & organization ID
- [ ] time entry overview
  - [ ] layout
  - [ ] top menu bar
    - [ ] user menu
    - [ ] i18n
      - [ ] hr
      - [ ] en
  - [ ] calendar view
    - [ ] calendar item
      - [ ] details modal
  - [ ] add new item
- [ ] store
  - [ ] axios
    - [ ] get organization membership
    - [ ] get services
    - [ ] get filtered time entries
    - [ ] patch time entries
    - [ ] delete time entries
