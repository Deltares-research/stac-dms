# deltares-storage-finder

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run serve
```

### Lints and fixes files

```bash
npm run lint
```

## Adding an additional storage option

1. Add a *.md* file in *src/content* with the content to be displayed in the storage option dialog, named with the next number in the series.
2. In *src/stores/app.js* add another object in the *cards* array, with the following key-value pairs:
   1. *id*: same number as the one its respective *.md* file was named.
   2. title: title that will be shown in the option card
   3. *subtitle*: subtitle that will be shown in the option card
   4. *allow*: an object with the key-value pairs containing which answer(s) are valid from each question, including those that should display an information icon indicating to contact the Data Platform Team.
   5. *contactOn*: an object with the key-value pairs containing which answer(s) from each question should display an information icon indicating to contact the Data Platform Team.

## Adding an additional question

1. In *src/stores/app.js*, add an extra key-value pair in the *answers* object, following the next number in the series. If the question will only admit a single answer, the value has to be an empty string; if the question will admit multiple answers, the value has to be an empty array.
2. In *components/QuestionsList.vue* add an additional radial group (if single-answer question) or checkbox group (if multiple-answer question). Link it to the answer model defined in the previous step and add a *value* parameter for each answer (see other examples for reference).
3. If the added question is dependent on the answer given in a previous question, add that rule in *rules* in *components/QuestionsList.vue*, include the necessary dynamic classes in its radial or checkbox group, and add a *const q[id]Enabled.*
4. In *components/QuestionsList.vue*, add the logic to reset the answer in *function resetAnswers* as an empty string (if single-answer question) or emty array (if multiple-answer question).
5. In *src/stores/app.js* add to every object in *cards* what is their expected behaviour with the new question (i.e. which values make the answer to stay highlighted and if any of the answers make the information icon indicating to contact the Data Platform Team appear).

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
