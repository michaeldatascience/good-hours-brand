# Good Hours

A static catalog for Good Hours, a US brand of at-home recovery gadgets. It lists products. There is no cart, no checkout, and no accounts.

The live source is [github.com/michaeldatascience/good-hours-brand](https://github.com/michaeldatascience/good-hours-brand).

## Install it on a Windows PC

You need Node.js 22. That is the program that runs the site on your computer. It includes npm, which installs the project's pieces.

### 1. Install Node

1. Open [https://nodejs.org](https://nodejs.org).
2. Download the **Windows Installer** for the **22 LTS** line.
3. Run the installer. Leave the defaults on, including **Add to PATH**.
4. Close any open PowerShell or Command Prompt windows, then open a new one.

Check it:

```powershell
node -v
npm -v
```

`node -v` should start with `v22`.

### 2. Get the files

**With Git (best if you will keep editing)**

1. Install Git from [https://git-scm.com/download/win](https://git-scm.com/download/win). The defaults are fine.
2. Open PowerShell and run:

```powershell
cd $HOME\Documents
git clone https://github.com/michaeldatascience/good-hours-brand.git
cd good-hours-brand
```

**With a ZIP (fine for a first look)**

1. Open [https://github.com/michaeldatascience/good-hours-brand](https://github.com/michaeldatascience/good-hours-brand).
2. Click **Code**, then **Download ZIP**.
3. Unzip it. You should see a folder that contains `package.json`.
4. In File Explorer, open that folder, click the address bar, type `powershell`, and press Enter.

The editor in the next section needs the hidden `.git` folder. A Git clone has it. A ZIP from GitHub does not, so use Git if you want the on-screen editor.

### 3. Install and start

In the project folder:

```powershell
npm install
npm run dev
```

The first command downloads the tools. The second starts the site. Leave that window open.

Open [http://localhost:4321](http://localhost:4321). Stop the site later with Ctrl+C.

## Edit the words and photos

1. With `npm run dev` still running, open [http://localhost:4321/admin/](http://localhost:4321/admin/) in **Chrome or Edge**. Firefox and Safari cannot use this editor.
2. Click **Work with Local Repository**.
3. Choose this project folder (the folder that contains `package.json`). The hidden `.git` folder has to stay in that folder so the editor knows it is the project. You do not need a GitHub login for this.
4. Edit in the forms and click Save. The site at localhost updates.

You can also edit the files in `src/content/` with any text editor. The forms and the files are the same words.

Photos you upload in the editor land in `src/assets/images/`. If a photo is missing, the page shows a drawn placeholder. In draft mode, that placeholder includes the shot note so a photographer knows what to take.

## Build the finished files

```powershell
npm run build
```

This checks the copy for banned claims, then writes the finished site into `dist/`. Copy that folder to any web host. It is plain HTML, CSS, JavaScript, and images.

To look at the built files on your own computer:

```powershell
npm run preview
```

`draft: true` in `src/content/settings.yaml` keeps the yellow draft bar on, highlights values that start with `TBD:`, and tells search engines to stay away. Set `draft` to `false` when you are ready to launch. The build will then print any `TBD:` values still left in the content.

## A short guide for a new developer

Astro reads the files in this folder and turns them into a website. While `npm run dev` is running, it rebuilds when you save a file. Refresh the browser to see it. There is no database and no React. The finished site is plain HTML.

### Commands

| Command | What it does |
|---|---|
| `npm install` | Download the tools. Run this once after you get the folder, and again if `package.json` changes. |
| `npm run dev` | Start the site at http://localhost:4321 |
| `npm run check` | Scan the writing for banned words and dashes |
| `npm run build` | Run that scan, then write the finished site into `dist/` |
| `npm run preview` | Serve the files in `dist/` so you can click through the built site |

### Where to work

- `src/content/` is all of the writing. Product pages, home, policies, and journal posts live here. Change words here first.
- `src/pages/` is the URL map. `index.astro` is the home page. A file named `[slug].astro` makes one page per matching content file.
- `src/components/` is reusable pieces: header, product card, price, and so on.
- `src/styles/tokens.css` is the colors and type sizes. `src/styles/base.css` is the shared layout.
- `src/layouts/Base.astro` is the frame around every page (header, footer, title tag).
- `public/` is copied as-is. The editor lives in `public/admin/`.
- `dist/` is created by the build. Do not edit it by hand.

An `.astro` file has two parts. The top, between `---` lines, is a short script that loads data. The bottom is HTML. A `<style>` block in that file applies only to that component.

### Change a product

Open `src/content/products/recovery-light.yaml` and change the tagline. Save. The product page updates.

To add a product, copy an existing YAML file to a new name, such as `desk-lamp.yaml`. Set `status: active` when it should have its own page. `coming-soon` shows a card only. `hidden` is left out of the site. The file name becomes the URL: `/products/desk-lamp/`.

### Change the look

Start in `src/styles/tokens.css` for a color or a font size. Use `src/styles/base.css` for layout that many pages share. Use the `<style>` block inside one component when the change is only for that piece.

### Rules the build enforces

- Do not use medical claims. `scripts/check-claims.mjs` lists the banned words. `npm run build` stops if one appears.
- Do not use em dashes or en dashes in the copy. Write "3 to 5 hours".
- Unknown numbers stay as `TBD: your best guess`. Draft mode highlights them.
- Do not invent reviews, ratings, customer counts, press logos, awards, or test results.

`REVIEW.md` lists every page, the open TBDs, and the photo shot list.
