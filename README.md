# Good Hours

A static catalog for Good Hours, a US brand of at-home recovery gadgets. It lists products. There is no cart, no checkout, and no accounts.

## What you need

Install Node.js 22 (the long-term support line) from [https://nodejs.org](https://nodejs.org). That install includes npm.

## Run the site on this computer

Open a terminal in this project folder and run:

```bash
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

Leave that terminal running while you work. Stop it with Ctrl+C when you are done.

## Edit the words and photos

1. With `npm run dev` still running, open [http://localhost:4321/admin/](http://localhost:4321/admin/) in **Chrome or Edge**. Firefox and Safari cannot use this editor.
2. Click **Work with Local Repository**.
3. Choose this project folder (the folder that contains `package.json`). The hidden `.git` folder has to stay in that folder so the editor knows it is the project. You do not need to learn Git or sign in to anything.
4. Edit in the forms and click Save. The site at localhost updates.

You can also edit the files in `src/content/` with any text editor. The forms and the files are the same words.

Photos you upload in the editor land in `src/assets/images/`. If a photo is missing, the page shows a drawn placeholder. In draft mode, that placeholder includes the shot note so a photographer knows what to take.

## Build the finished files

```bash
npm run build
```

This checks the copy for banned claims, then writes the finished site into `dist/`. Copy that folder to any web host. It is plain HTML, CSS, JavaScript, and images.

`draft: true` in `src/content/settings.yaml` keeps the yellow draft bar on, highlights values that start with `TBD:`, and tells search engines to stay away. Set `draft` to `false` when you are ready to launch. The build will then print any `TBD:` values still left in the content.

## Where things live

- `src/content/` is all of the writing.
- `src/components/` and `src/pages/` are the layout. Day-to-day edits should not need those.
- `public/admin/` is the editor.
- `dist/` is the site you publish.
