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

- [x] login page
  - [x] layout
  - [x] i18n menu
- [x] not found page - redirect
- [x] time entry
  - [x] layout
  - [x] top menu bar
    - [x] user menu
    - [x] i18n menu
  - [x] calendar view
    - [x] calendar item
      - [x] details modal
  - [x] add new item
- [x] store
  - [x] hardcoded user token & organization ID
  - [x] axios
    - [x] get organization membership
    - [x] get services
    - [x] get filtered time entries
    - [x] patch time entries
    - [x] delete time entries
- [x] i18n
  - [x] hr
  - [x] en
